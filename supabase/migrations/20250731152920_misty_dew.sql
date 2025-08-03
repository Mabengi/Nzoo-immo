/*
  # Update RPC function to use correct column names

  This function updates the create_reservation_admin function to use
  the correct column names that match the database schema.
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS create_reservation_admin(jsonb);

-- Create updated function with correct column names
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
  -- Insert the reservation with correct column names
  INSERT INTO reservations (
    fullname,
    email,
    phone,
    company,
    activity,
    address,
    space_type,
    start_date,
    end_date,
    occupants,
    subscription_type,
    amount,
    payment_method,
    transaction_id,
    status,
    created_at
  )
  VALUES (
    (reservation_data->>'fullname')::text,
    (reservation_data->>'email')::text,
    (reservation_data->>'phone')::text,
    (reservation_data->>'company')::text,
    (reservation_data->>'activity')::text,
    (reservation_data->>'address')::text,
    (reservation_data->>'space_type')::text,
    (reservation_data->>'start_date')::date,
    (reservation_data->>'end_date')::date,
    (reservation_data->>'occupants')::integer,
    (reservation_data->>'subscription_type')::text,
    (reservation_data->>'amount')::numeric,
    (reservation_data->>'payment_method')::text,
    (reservation_data->>'transaction_id')::text,
    COALESCE((reservation_data->>'status')::text, 'pending'),
    COALESCE((reservation_data->>'created_at')::timestamptz, now())
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