-- Add order_index column to applications table for Kanban ordering
alter table applications add column if not exists order_index int default 0;

-- Initialize order_index for existing records (per user, per status)
-- Set order based on created_at (oldest first)
with ranked as (
  select 
    id,
    row_number() over (partition by user_id, status order by created_at) - 1 as new_order
  from applications
)
update applications
set order_index = ranked.new_order
from ranked
where applications.id = ranked.id;

-- Create index for better query performance
create index if not exists idx_applications_order on applications(user_id, status, order_index);

-- Comment
comment on column applications.order_index is 'Order of application cards within each Kanban column';
