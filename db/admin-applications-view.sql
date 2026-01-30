-- View to simplify admin queries for applications
-- Joins applications with profiles to get user details
create or replace view admin_applications_view as
select 
    a.id,
    a.user_id,
    a.company,
    a.position,
    a.status,
    a.salary,
    a.contact,
    a.source,
    a.apply_date,
    a.created_at,
    a.order_index,
    a.notes,
    a.poster_path,
    p.email as user_email,
    p.full_name as user_name,
    p.avatar_url as user_avatar
from applications a
left join profiles p on a.user_id = p.id;

-- Grant access to service_role (and postgres/authenticated if needed)
grant select on admin_applications_view to service_role;
grant select on admin_applications_view to postgres;
-- We don't grant to anon or authenticated to keep it admin-only implicitly (or relying on RLS if we used tables directly, but views are tricky)
-- Since we use service_role client in admin dashboard, this is fine.
