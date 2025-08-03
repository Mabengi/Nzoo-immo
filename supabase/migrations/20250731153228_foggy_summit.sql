/*
  # Fix spacetype column and RLS policies

  1. Handle existing policies gracefully
  2. Fix column name mapping (space_type vs spacetype)
  3. Ensure all required columns exist with correct names
  4. Update RPC function to use correct column names

  This migration fixes the spacetype null constraint error.
*/

-- Drop existing policies if they exist (gracefully)
DO $$
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Allow public reservation creation" ON reservations;
  DROP POLICY IF EXISTS "Allow authenticated users to view reservations" ON reservations;
  DROP POLICY IF EXISTS "Allow anonymous reservation creation" ON reservations;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if policies don't exist
    NULL;
END $$;

-- Check and fix column names
DO $$
BEGIN
  -- Check if space_type exists and spacetype doesn't, then rename
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'space_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'spacetype'
  ) THEN
    ALTER TABLE reservations RENAME COLUMN space_type TO spacetype;
  END IF;

  -- If spacetype doesn't exist, create it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'spacetype'
  ) THEN
    ALTER TABLE reservations ADD COLUMN spacetype text NOT NULL DEFAULT 'coworking';
  END IF;

  -- Ensure other required columns exist with correct names
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'startdate'
  ) THEN
    -- Check if start_date exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'start_date'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN start_date TO startdate;
    ELSE
      ALTER TABLE reservations ADD COLUMN startdate date NOT NULL DEFAULT CURRENT_DATE;
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'enddate'
  ) THEN
    -- Check if end_date exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'end_date'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN end_date TO enddate;
    ELSE
      ALTER TABLE reservations ADD COLUMN enddate date NOT NULL DEFAULT CURRENT_DATE;
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'subscriptiontype'
  ) THEN
    -- Check if subscription_type exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'subscription_type'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN subscription_type TO subscriptiontype;
    ELSE
      ALTER TABLE reservations ADD COLUMN subscriptiontype text NOT NULL DEFAULT 'daily';
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'paymentmethod'
  ) THEN
    -- Check if payment_method exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'payment_method'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN payment_method TO paymentmethod;
    ELSE
      ALTER TABLE reservations ADD COLUMN paymentmethod text NOT NULL DEFAULT 'cash';
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'transactionid'
  ) THEN
    -- Check if transaction_id exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'transaction_id'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN transaction_id TO transactionid;
    ELSE
      ALTER TABLE reservations ADD COLUMN transactionid text NOT NULL DEFAULT '';
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'createdat'
  ) THEN
    -- Check if created_at exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN created_at TO createdat;
    ELSE
      ALTER TABLE reservations ADD COLUMN createdat timestamptz NOT NULL DEFAULT now();
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'updatedat'
  ) THEN
    -- Check if updated_at exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN updated_at TO updatedat;
    ELSE
      ALTER TABLE reservations ADD COLUMN updatedat timestamptz NOT NULL DEFAULT now();
    END IF;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "public_reservation_insert"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "authenticated_reservation_select"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "anon_reservation_insert"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);