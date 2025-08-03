/*
  # Fix RLS policies for reservations table

  1. Drop existing restrictive policies
  2. Create new policies that allow public insertions
  3. Update RPC function to use SECURITY DEFINER properly
  4. Ensure anonymous users can create reservations

  This migration fixes the RLS policy violation error.
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "reservations_public_insert_policy" ON reservations;
DROP POLICY IF EXISTS "reservations_authenticated_select_policy" ON reservations;
DROP POLICY IF EXISTS "reservations_anon_insert_policy" ON reservations;
DROP POLICY IF EXISTS "public_reservation_insert" ON reservations;
DROP POLICY IF EXISTS "authenticated_reservation_select" ON reservations;
DROP POLICY IF EXISTS "anon_reservation_insert" ON reservations;
DROP POLICY IF EXISTS "Allow public reservation creation" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to view reservations" ON reservations;
DROP POLICY IF EXISTS "Allow anonymous reservation creation" ON reservations;

-- Ensure RLS is enabled
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for reservations
CREATE POLICY "allow_all_inserts"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_select"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_anon_insert"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Drop and recreate the RPC function with proper SECURITY DEFINER
DROP FUNCTION IF EXISTS create_reservation_admin(jsonb);

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

  -- Insert the reservation (SECURITY DEFINER bypasses RLS)
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
    RAISE NOTICE 'Error creating reservation: % - %. Input data: %', SQLSTATE, SQLERRM, reservation_data;
    RAISE EXCEPTION 'Failed to create reservation: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Grant execute permission to all user types
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO public;

-- Add comment
COMMENT ON FUNCTION create_reservation_admin(jsonb) IS 'Creates a reservation with elevated privileges, bypassing RLS';