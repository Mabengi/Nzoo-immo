/*
  # Recreate reservation RPC function with correct signature

  1. Drop existing function if it exists
  2. Create new function with proper date handling and parameter mapping
  3. Grant necessary permissions

  This fixes the "cannot change return type" error by dropping and recreating the function.
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS create_reservation_admin(jsonb);

-- Create the RPC function for reservation creation with proper date handling
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

  -- Parse and validate dates with explicit error handling
  BEGIN
    -- Extract date strings and convert to date type
    start_date_val := (reservation_data->>'startDate')::date;
    end_date_val := (reservation_data->>'endDate')::date;
    
    RAISE NOTICE 'Parsed dates - Start: %, End: %', start_date_val, end_date_val;
    
    -- Validate that end date is not before start date
    IF end_date_val < start_date_val THEN
      RAISE EXCEPTION 'End date cannot be before start date';
    END IF;
    
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid date format. Start: "%" (type: %), End: "%" (type: %). Error: %', 
        (reservation_data->>'startDate'), 
        pg_typeof(reservation_data->>'startDate'),
        (reservation_data->>'endDate'),
        pg_typeof(reservation_data->>'endDate'),
        SQLERRM;
  END;

  -- Insert the reservation with explicit column mapping
  INSERT INTO reservations (
    fullname,        -- maps from fullName
    email,           -- maps from email
    phone,           -- maps from phone
    company,         -- maps from company (nullable)
    activity,        -- maps from activity
    address,         -- maps from address (nullable)
    spacetype,       -- maps from spaceType
    startdate,       -- maps from startDate (parsed above)
    enddate,         -- maps from endDate (parsed above)
    occupants,       -- maps from occupants
    subscriptiontype, -- maps from subscriptionType
    amount,          -- maps from amount
    paymentmethod,   -- maps from paymentMethod
    transactionid,   -- maps from transactionId
    status,          -- maps from status
    createdat        -- maps from createdAt or now()
  )
  VALUES (
    COALESCE(NULLIF(TRIM(reservation_data->>'fullName'), ''), 'Unknown'),
    COALESCE(NULLIF(TRIM(reservation_data->>'email'), ''), 'no-email@example.com'),
    COALESCE(NULLIF(TRIM(reservation_data->>'phone'), ''), 'N/A'),
    NULLIF(TRIM(reservation_data->>'company'), ''),
    COALESCE(NULLIF(TRIM(reservation_data->>'activity'), ''), 'Not specified'),
    NULLIF(TRIM(reservation_data->>'address'), ''),
    COALESCE(NULLIF(TRIM(reservation_data->>'spaceType'), ''), 'coworking'),
    start_date_val,  -- Use the parsed and validated date
    end_date_val,    -- Use the parsed and validated date
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
    -- Log the error details with more context
    RAISE NOTICE 'Error creating reservation: % - %. Input data: %', SQLSTATE, SQLERRM, reservation_data;
    RAISE EXCEPTION 'Failed to create reservation: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Grant execute permission to all user types
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO public;

-- Add a comment to document the function
COMMENT ON FUNCTION create_reservation_admin(jsonb) IS 'Creates a reservation with elevated privileges, bypassing RLS. Accepts reservation data as JSON and returns the created reservation.';