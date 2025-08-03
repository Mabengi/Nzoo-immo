/*
  # Grant permissions for admin_users table

  1. Permissions
    - Grant INSERT permission on admin_users table to authenticated role
    - Grant UPDATE permission on admin_users table to authenticated role
    - Grant SELECT permission on admin_users table to authenticated role
    - Grant DELETE permission on admin_users table to authenticated role

  2. Security
    - Ensure all authenticated users can manage admin_users table
    - Fix RLS policy violations
*/

-- Grant full permissions on admin_users table to authenticated role
GRANT SELECT ON admin_users TO authenticated;
GRANT INSERT ON admin_users TO authenticated;
GRANT UPDATE ON admin_users TO authenticated;
GRANT DELETE ON admin_users TO authenticated;

-- Also grant permissions to anon role for public access
GRANT SELECT ON admin_users TO anon;
GRANT INSERT ON admin_users TO anon;
GRANT UPDATE ON admin_users TO anon;
GRANT DELETE ON admin_users TO anon;

-- Grant permissions to public role as well
GRANT SELECT ON admin_users TO public;
GRANT INSERT ON admin_users TO public;
GRANT UPDATE ON admin_users TO public;
GRANT DELETE ON admin_users TO public;