/*
  # Fix RPC function to properly handle JavaScript property names

  This function correctly maps JavaScript camelCase property names 
  to database column names (without underscores).
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS create_reservation_admin(jsonb);

-- Create the corrected RPC function
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
  -- Log the input data for debugging
  RAISE NOTICE 'Input reservation_data: %', reservation_data;

  -- Insert the reservation with correct mapping from JavaScript to database columns
  INSERT INTO reservations (
    fullname,        -- maps from fullName
    email,           -- maps from email
    phone,           -- maps from phone
    company,         -- maps from company
    activity,        -- maps from activity
    address,         -- maps from address
    spacetype,       -- maps from spaceType
    startdate,       -- maps from startDate
    enddate,         -- maps from endDate
    occupants,       -- maps from occupants
    subscriptiontype, -- maps from subscriptionType
    amount,          -- maps from amount
    paymentmethod,   -- maps from paymentMethod
    transactionid,   -- maps from transactionId
    status,          -- maps from status
    createdat        -- maps from createdAt
  )
  VALUES (
    COALESCE((reservation_data->>'fullName')::text, ''),
    COALESCE((reservation_data->>'email')::text, ''),
    COALESCE((reservation_data->>'phone')::text, ''),
    (reservation_data->>'company')::text,
    COALESCE((reservation_data->>'activity')::text, ''),
    (reservation_data->>'address')::text,
    COALESCE((reservation_data->>'spaceType')::text, 'coworking'),
    COALESCE((reservation_data->>'startDate')::date, CURRENT_DATE),
    COALESCE((reservation_data->>'endDate')::date, CURRENT_DATE),
    COALESCE((reservation_data->>'occupants')::integer, 1),
    COALESCE((reservation_data->>'subscriptionType')::text, 'daily'),
    COALESCE((reservation_data->>'amount')::numeric, 0),
    COALESCE((reservation_data->>'paymentMethod')::text, 'cash'),
    COALESCE((reservation_data->>'transactionId')::text, ''),
    COALESCE((reservation_data->>'status')::text, 'pending'),
    COALESCE((reservation_data->>'createdAt')::timestamptz, now())
  )
  RETURNING * INTO new_reservation;

  -- Log the created reservation
  RAISE NOTICE 'Created reservation with ID: %', new_reservation.id;

  -- Return the created reservation as JSON
  SELECT to_jsonb(new_reservation) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error details
    RAISE NOTICE 'Error creating reservation: % - %', SQLSTATE, SQLERRM;
    RAISE EXCEPTION 'Failed to create reservation: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Grant execute permission to all user types
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO public;