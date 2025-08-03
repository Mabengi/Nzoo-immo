/*
  # Fix column names in reservations table

  1. Check current table structure
  2. Rename columns to match expected names if needed
  3. Ensure all constraints are properly set

  This migration ensures the table structure matches the application expectations.
*/

-- First, let's check if we need to rename columns
DO $$
BEGIN
  -- Check if full_name column exists and rename it to fullname
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE reservations RENAME COLUMN full_name TO fullname;
  END IF;

  -- Ensure fullname column exists and is not null
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'fullname'
  ) THEN
    ALTER TABLE reservations ADD COLUMN fullname text NOT NULL DEFAULT '';
  END IF;

  -- Ensure other required columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'space_type'
  ) THEN
    ALTER TABLE reservations ADD COLUMN space_type text NOT NULL DEFAULT 'coworking';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE reservations ADD COLUMN start_date date NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE reservations ADD COLUMN end_date date NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'subscription_type'
  ) THEN
    ALTER TABLE reservations ADD COLUMN subscription_type text NOT NULL DEFAULT 'daily';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE reservations ADD COLUMN payment_method text NOT NULL DEFAULT 'cash';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'transaction_id'
  ) THEN
    ALTER TABLE reservations ADD COLUMN transaction_id text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to use correct column names
DROP POLICY IF EXISTS "Allow public reservation creation" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to view reservations" ON reservations;
DROP POLICY IF EXISTS "Allow anonymous reservation creation" ON reservations;

-- Create policies that allow public insertions
CREATE POLICY "Allow public reservation creation"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous reservation creation"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);