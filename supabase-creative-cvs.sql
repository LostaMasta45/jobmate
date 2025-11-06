-- Quick Setup: Creative CVs Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.creative_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  template_id TEXT NOT NULL,
  color_scheme JSONB NOT NULL DEFAULT '{"primary":"#2563eb","secondary":"#1e40af","accent":"#3b82f6","background":"#ffffff","text":"#1e293b"}'::jsonb,
  typography JSONB DEFAULT '{"style":"modern","headingFont":"Inter","bodyFont":"Inter"}'::jsonb,
  layout_options JSONB DEFAULT '{"columns":2,"spacing":"comfortable","sectionOrder":["summary","experience","education","skills"]}'::jsonb,
  photo_url TEXT,
  photo_options JSONB DEFAULT '{"position":"header-left","shape":"circle","size":"medium","border":{"style":"solid","color":"#2563eb","width":2},"filter":"none"}'::jsonb,
  content JSONB NOT NULL,
  ats_score INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creative_cvs_user_id ON public.creative_cvs(user_id);
CREATE INDEX idx_creative_cvs_created_at ON public.creative_cvs(created_at DESC);

ALTER TABLE public.creative_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own creative CVs" ON public.creative_cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own creative CVs" ON public.creative_cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own creative CVs" ON public.creative_cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own creative CVs" ON public.creative_cvs FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON public.creative_cvs TO authenticated;
GRANT ALL ON public.creative_cvs TO service_role;
