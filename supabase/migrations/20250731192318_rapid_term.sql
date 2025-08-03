/*
  # Fix reservations table structure

  1. Check current table structure and add missing columns
  2. Ensure all required columns exist with correct names
  3. Update RPC function to match actual table structure

  This migration fixes column name mismatches between the RPC function and actual table.
*/

-- First, let's check what columns actually exist and add missing ones
DO $$
BEGIN
  -- Add fullname column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'fullname'
  ) THEN
    -- Check if full_name exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'full_name'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN full_name TO fullname;
    ELSE
      ALTER TABLE reservations ADD COLUMN fullname text NOT NULL DEFAULT '';
    END IF;
  END IF;

  -- Add spacetype column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'spacetype'
  ) THEN
    -- Check if space_type exists and rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'space_type'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN space_type TO spacetype;
    ELSE
      ALTER TABLE reservations ADD COLUMN spacetype text NOT NULL DEFAULT 'coworking';
    END IF;
  END IF;

  -- Add startdate column if it doesn't exist
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

  -- Add enddate column if it doesn't exist
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

  -- Add subscriptiontype column if it doesn't exist
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

  -- Add paymentmethod column if it doesn't exist
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

  -- Add transactionid column if it doesn't exist
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

  -- Add createdat column if it doesn't exist
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

  -- Add updatedat column if it doesn't exist
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

  -- Ensure other required columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'email'
  ) THEN
    ALTER TABLE reservations ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'phone'
  ) THEN
    ALTER TABLE reservations ADD COLUMN phone text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'company'
  ) THEN
    ALTER TABLE reservations ADD COLUMN company text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'activity'
  ) THEN
    ALTER TABLE reservations ADD COLUMN activity text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'address'
  ) THEN
    ALTER TABLE reservations ADD COLUMN address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'occupants'
  ) THEN
    ALTER TABLE reservations ADD COLUMN occupants integer NOT NULL DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'amount'
  ) THEN
    ALTER TABLE reservations ADD COLUMN amount numeric NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'status'
  ) THEN
    ALTER TABLE reservations ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;

END $$;

-- Ensure RLS is enabled
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Add comment to document the table structure
COMMENT ON TABLE reservations IS 'Reservations table with columns using no underscores naming convention';