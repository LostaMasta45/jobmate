-- ============================================
-- STEP 1: Create wa_templates table FIRST
-- ============================================

-- WhatsApp Templates Table
-- Pre-built and user custom templates

create table if not exists wa_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  message_type text not null check (message_type in ('application', 'follow_up', 'interview_confirmation', 'thank_you', 'status_inquiry', 're_application', 'referral')),
  template_content text not null, -- Template with [PLACEHOLDERS]
  
  -- Default Settings
  default_tone text default 'semi-formal',
  default_personality text default 'balanced',
  default_length text default 'medium',
  use_emoji boolean default false,
  
  -- System or User
  is_system boolean default false, -- Pre-built templates
  user_id uuid references auth.users(id) on delete cascade, -- User custom templates
  
  -- Usage Stats
  usage_count integer default 0,
  
  -- Display Order
  display_order integer default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for wa_templates
create index if not exists idx_wa_templates_type on wa_templates(message_type);
create index if not exists idx_wa_templates_system on wa_templates(is_system);
create index if not exists idx_wa_templates_user on wa_templates(user_id);

-- Enable RLS for wa_templates
alter table wa_templates enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can view system templates" on wa_templates;
drop policy if exists "Users can insert own templates" on wa_templates;
drop policy if exists "Users can update own templates" on wa_templates;
drop policy if exists "Users can delete own templates" on wa_templates;

-- RLS Policy: Anyone can view system templates
create policy "Anyone can view system templates"
on wa_templates for select
using (is_system = true or auth.uid() = user_id);

-- RLS Policy: Users can manage own templates
create policy "Users can insert own templates"
on wa_templates for insert
with check (auth.uid() = user_id and is_system = false);

create policy "Users can update own templates"
on wa_templates for update
using (auth.uid() = user_id);

create policy "Users can delete own templates"
on wa_templates for delete
using (auth.uid() = user_id);

-- ============================================
-- STEP 2: Create wa_messages table
-- ============================================

-- WhatsApp Messages Table
-- Stores all generated WhatsApp messages for job applications

create table if not exists wa_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Message Details
  message_type text not null check (message_type in ('application', 'follow_up', 'interview_confirmation', 'thank_you', 'status_inquiry', 're_application', 'referral')),
  content text not null, -- Generated message (clean, no spintax)
  
  -- Context
  position text not null,
  company_name text not null,
  hrd_name text,
  hrd_title text,
  hrd_phone text,
  job_source text,
  referral_name text,
  previous_interaction text,
  
  -- Your Info
  applicant_current_role text,
  years_experience integer,
  top_skills text[],
  specific_reason text,
  recent_achievement text,
  availability text,
  
  -- Metadata
  tone_style text default 'semi-formal' check (tone_style in ('formal', 'semi-formal', 'friendly', 'enthusiastic')),
  personality text default 'balanced' check (personality in ('confident', 'humble', 'balanced')),
  message_length text default 'medium' check (message_length in ('short', 'medium', 'long')),
  use_emoji boolean default false,
  
  -- Preferences
  include_greeting boolean default true,
  include_intro boolean default true,
  include_call_to_action boolean default true,
  attachment_mention boolean default false,
  
  -- Analytics
  word_count integer,
  char_count integer,
  
  -- Usage
  template_id uuid references wa_templates(id) on delete set null,
  application_id uuid references applications(id) on delete set null, -- Link to job tracker
  times_copied integer default 0,
  sent_at timestamptz, -- When user clicked "Send via WA"
  
  -- AI Metadata
  ai_model text default 'gpt-4o-mini',
  generation_count integer default 1,
  
  -- Status
  status text default 'draft' check (status in ('draft', 'sent', 'archived')),
  notes text,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_wa_messages_user_id on wa_messages(user_id);
create index if not exists idx_wa_messages_type on wa_messages(message_type);
create index if not exists idx_wa_messages_application on wa_messages(application_id);
create index if not exists idx_wa_messages_created_at on wa_messages(created_at desc);
create index if not exists idx_wa_messages_company on wa_messages(company_name);

-- Enable Row Level Security
alter table wa_messages enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own WA messages" on wa_messages;
drop policy if exists "Users can insert own WA messages" on wa_messages;
drop policy if exists "Users can update own WA messages" on wa_messages;
drop policy if exists "Users can delete own WA messages" on wa_messages;

-- RLS Policy: Users can only access their own messages
create policy "Users can view own WA messages"
on wa_messages for select
using (auth.uid() = user_id);

create policy "Users can insert own WA messages"
on wa_messages for insert
with check (auth.uid() = user_id);

create policy "Users can update own WA messages"
on wa_messages for update
using (auth.uid() = user_id);

create policy "Users can delete own WA messages"
on wa_messages for delete
using (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
create or replace function update_wa_messages_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
drop trigger if exists wa_messages_updated_at on wa_messages;
create trigger wa_messages_updated_at
  before update on wa_messages
  for each row
  execute function update_wa_messages_updated_at();

-- ============================================
-- STEP 3: Insert System Templates
-- ============================================

-- Insert System Templates
insert into wa_templates (name, description, message_type, template_content, default_tone, default_length, is_system, display_order)
values
  (
    'Express Application',
    'Pesan cepat untuk apply, cocok untuk startup/informal',
    'application',
    'Halo Kak,

Saya [NAMA], tertarik untuk posisi [POSISI] di [PERUSAHAAN].
[EXPERIENCE]

Boleh info lebih lanjut? 🙏

[NAMA]',
    'friendly',
    'short',
    true,
    1
  ),
  (
    'Professional Application',
    'Format profesional untuk perusahaan corporate',
    'application',
    'Selamat pagi Bapak/Ibu [HRD_NAME],

Perkenalkan, saya [NAMA], [CURRENT_ROLE] dengan pengalaman [YEARS] tahun di [SKILLS].

Saya tertarik untuk melamar posisi [POSISI] di [PERUSAHAAN] yang saya lihat di [JOB_SOURCE]. 
[SPECIFIC_REASON]

Apakah lowongan ini masih terbuka? Saya siap mengirimkan CV dan portofolio.

Terima kasih atas perhatiannya.

Hormat saya,
[NAMA]',
    'formal',
    'medium',
    true,
    2
  ),
  (
    'Polite Follow-Up',
    'Follow-up sopan 3-7 hari setelah apply',
    'follow_up',
    'Assalamu''alaikum Kak [HRD_NAME],

Saya [NAMA], beberapa hari lalu sudah mengirimkan lamaran untuk posisi [POSISI].

Apakah ada update terkait proses seleksi?

Terima kasih 🙏',
    'semi-formal',
    'short',
    true,
    3
  ),
  (
    'Interview Confirmation',
    'Konfirmasi kehadiran interview',
    'interview_confirmation',
    'Terima kasih Kak [HRD_NAME] atas undangan interviewnya 🙏

Saya [NAMA] konfirmasi hadir untuk interview posisi [POSISI] pada:
📅 [DATE]
🕐 [TIME]
📍 [LOCATION]

[AVAILABILITY_NOTE]

Sampai jumpa!

[NAMA]',
    'friendly',
    'short',
    true,
    4
  ),
  (
    'Post-Interview Thank You',
    'Terima kasih dalam 24 jam setelah interview',
    'thank_you',
    'Halo Kak [HRD_NAME],

Terima kasih banyak atas kesempatan interview hari ini untuk posisi [POSISI] 🙏

Saya sangat senang bisa diskusi lebih dalam tentang role ini dan visi [PERUSAHAAN].

[SPECIFIC_TAKEAWAY]

Ditunggu kabar selanjutnya ✨

Best regards,
[NAMA]',
    'friendly',
    'medium',
    true,
    5
  ),
  (
    'Status Inquiry',
    'Tanya status 1-2 minggu setelah interview',
    'status_inquiry',
    'Selamat siang Kak [HRD_NAME],

Saya [NAMA], sebelumnya sudah interview untuk posisi [POSISI].

Apakah ada info update terkait hasil interviewnya?

Terima kasih 🙏',
    'semi-formal',
    'short',
    true,
    6
  )
on conflict do nothing;

-- Comments
comment on table wa_messages is 'Stores all generated WhatsApp messages for job applications';
comment on table wa_templates is 'Pre-built and user custom WhatsApp message templates';
