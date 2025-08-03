/*
  # Update RPC function with correct column names

  This function creates reservations using the correct column names
  that match the actual database schema.
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS create_reservation_admin(jsonb);

-- Create updated function with correct column names (no underscores)
CREATE OR REPLACE FUNCTION create_reservation_admin(reservation_data jsonb)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_reservation reservations%ROWTYPE;
  result jsonb;
BEGIN
  -- Insert the reservation with correct column names (no underscores)
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
    (reservation_data->>'fullName')::text,
    (reservation_data->>'email')::text,
    (reservation_data->>'phone')::text,
    (reservation_data->>'company')::text,
    (reservation_data->>'activity')::text,
    (reservation_data->>'address')::text,
    (reservation_data->>'spaceType')::text,
    (reservation_data->>'startDate')::date,
    (reservation_data->>'endDate')::date,
    (reservation_data->>'occupants')::integer,
    (reservation_data->>'subscriptionType')::text,
    (reservation_data->>'amount')::numeric,
    (reservation_data->>'paymentMethod')::text,
    (reservation_data->>'transactionId')::text,
    COALESCE((reservation_data->>'status')::text, 'pending'),
    COALESCE((reservation_data->>'createdAt')::timestamptz, now())
  )
  RETURNING * INTO new_reservation;

  -- Return the created reservation as JSON
  SELECT to_jsonb(new_reservation) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise it
    RAISE EXCEPTION 'Failed to create reservation: %', SQLERRM;
END;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO authenticated;