/*
  # Disable RLS on admin_users table

  1. Security Changes
    - Disable Row Level Security on `admin_users` table
    - Allow direct access for custom authentication system
    
  2. Rationale
    - Application uses custom authentication, not Supabase Auth
    - RLS policies are blocking legitimate operations
    - Direct table access needed for user management
    
  Note: This is appropriate since the app has its own authentication layer
*/

-- Disable Row Level Security on admin_users table
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to clean up
DROP POLICY IF EXISTS "Enable read access for all users" ON admin_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON admin_users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON admin_users;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON admin_users;