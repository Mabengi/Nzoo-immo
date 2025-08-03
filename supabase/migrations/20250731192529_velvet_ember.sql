/*
  # Fix RPC function syntax and create working reservation function

  1. Drop existing function if it exists
  2. Create new function with proper SQL syntax
  3. Ensure all columns exist in the reservations table
  4. Grant necessary permissions

  This migration fixes the unterminated comment error and creates a working RPC function.
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS create_reservation_admin(jsonb);

-- First, ensure the reservations table has all required columns
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
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'reservations' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE reservations RENAME COLUMN created_at TO createdat;
    ELSE
      ALTER TABLE reservations ADD COLUMN createdat timestamptz NOT NULL DEFAULT now();
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
    WHERE table_name = 'reservations' AND column_name = 'activity'
  ) THEN
    ALTER TABLE reservations ADD COLUMN activity text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'company'
  ) THEN
    ALTER TABLE reservations ADD COLUMN company text;
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

-- Create the RPC function with proper syntax
CREATE OR REPLACE FUNCTION create_reservation_admin(reservation_data jsonb)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_reservation reservations%ROWTYPE;
  result jsonb;
  start_date_val date;
  end_date_val date;
BEGIN
  -- Log the input data for debugging
  RAISE NOTICE 'Input reservation_data: %', reservation_data;

  -- Parse and validate dates
  BEGIN
    start_date_val := (reservation_data->>'startDate')::date;
    end_date_val := (reservation_data->>'endDate')::date;
    
    RAISE NOTICE 'Parsed dates - Start: %, End: %', start_date_val, end_date_val;
    
    -- Validate that end date is not before start date
    IF end_date_val < start_date_val THEN
      RAISE EXCEPTION 'End date cannot be before start date';
    END IF;
    
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid date format. Start: %, End: %. Error: %', 
        (reservation_data->>'startDate'), 
        (reservation_data->>'endDate'),
        SQLERRM;
  END;

  -- Insert the reservation
  INSERT INTO reservations (
    fullname,
    email,
    phone,
    company,
    activity,
    address,
    spacetype,
    startdate,
    enddate,
    occupants,
    subscriptiontype,
    amount,
    paymentmethod,
    transactionid,
    status,
    createdat
  )
  VALUES (
    COALESCE(NULLIF(TRIM(reservation_data->>'fullName'), ''), 'Unknown'),
    COALESCE(NULLIF(TRIM(reservation_data->>'email'), ''), 'no-email@example.com'),
    COALESCE(NULLIF(TRIM(reservation_data->>'phone'), ''), 'N/A'),
    NULLIF(TRIM(reservation_data->>'company'), ''),
    COALESCE(NULLIF(TRIM(reservation_data->>'activity'), ''), 'Not specified'),
    NULLIF(TRIM(reservation_data->>'address'), ''),
    COALESCE(NULLIF(TRIM(reservation_data->>'spaceType'), ''), 'coworking'),
    start_date_val,
    end_date_val,
    COALESCE((reservation_data->>'occupants')::integer, 1),
    COALESCE(NULLIF(TRIM(reservation_data->>'subscriptionType'), ''), 'daily'),
    COALESCE((reservation_data->>'amount')::numeric, 0),
    COALESCE(NULLIF(TRIM(reservation_data->>'paymentMethod'), ''), 'cash'),
    COALESCE(NULLIF(TRIM(reservation_data->>'transactionId'), ''), 'N/A'),
    COALESCE(NULLIF(TRIM(reservation_data->>'status'), ''), 'pending'),
    COALESCE((reservation_data->>'createdAt')::timestamptz, now())
  )
  RETURNING * INTO new_reservation;

  -- Log the created reservation
  RAISE NOTICE 'Created reservation with ID: %, Start: %, End: %, FullName: %', 
    new_reservation.id, 
    new_reservation.startdate, 
    new_reservation.enddate,
    new_reservation.fullname;

  -- Return the created reservation as JSON
  SELECT to_jsonb(new_reservation) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error details
    RAISE NOTICE 'Error creating reservation: % - %. Input data: %', SQLSTATE, SQLERRM, reservation_data;
    RAISE EXCEPTION 'Failed to create reservation: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Grant execute permission to all user types
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO public;

-- Ensure RLS is enabled
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create or update RLS policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "reservations_public_insert_policy" ON reservations;
  DROP POLICY IF EXISTS "reservations_authenticated_select_policy" ON reservations;
  DROP POLICY IF EXISTS "reservations_anon_insert_policy" ON reservations;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore errors if policies don't exist
END $$;

-- Create new policies
CREATE POLICY "reservations_public_insert_policy"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "reservations_authenticated_select_policy"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "reservations_anon_insert_policy"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);