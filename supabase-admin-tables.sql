-- Create usage_logs table for tracking tool usage
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_actions table for tracking admin activities
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_logs table for general system logging
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'success')),
  message TEXT NOT NULL,
  source TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_tool_name ON public.usage_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON public.admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_source ON public.system_logs(source);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage_logs
CREATE POLICY "Users can view their own usage logs"
  ON public.usage_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage logs"
  ON public.usage_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert usage logs"
  ON public.usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for admin_actions
CREATE POLICY "Only admins can view admin actions"
  ON public.admin_actions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert admin actions"
  ON public.admin_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for system_logs
CREATE POLICY "Only admins can view system logs"
  ON public.system_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert logs"
  ON public.system_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to log admin actions automatically
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when an application status is changed by admin
  IF (TG_TABLE_NAME = 'account_applications' AND OLD.status != NEW.status) THEN
    INSERT INTO public.admin_actions (admin_id, target_user_id, action, details)
    VALUES (
      auth.uid(),
      NULL,
      'application_status_changed',
      jsonb_build_object(
        'application_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'applicant_email', NEW.email
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for admin actions logging
DROP TRIGGER IF EXISTS trigger_log_admin_action ON public.account_applications;
CREATE TRIGGER trigger_log_admin_action
  AFTER UPDATE ON public.account_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

-- Insert some sample system logs for demo
INSERT INTO public.system_logs (level, message, source, metadata) VALUES
  ('info', 'System initialized successfully', 'system', '{"version": "2.0.0"}'::jsonb),
  ('success', 'Database migrations completed', 'database', '{"tables_created": 3}'::jsonb);

COMMENT ON TABLE public.usage_logs IS 'Tracks tool usage by users for analytics';
COMMENT ON TABLE public.admin_actions IS 'Audit log for admin activities';
COMMENT ON TABLE public.system_logs IS 'General system logging for monitoring and debugging';
