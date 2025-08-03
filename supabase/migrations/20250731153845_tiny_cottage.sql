/*
  # Create complete reservations table with correct schema

  1. New Tables
    - `reservations` with all required columns using correct naming convention
  
  2. Security
    - Enable RLS on `reservations` table
    - Add policies for public reservation creation
    - Add policies for authenticated users to view reservations

  3. RPC Function
    - Create function to handle reservation creation with elevated privileges
*/

-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS reservations CASCADE;

-- Create reservations table with correct column names (no underscores)
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fullname text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  activity text NOT NULL,
  address text,
  spacetype text NOT NULL DEFAULT 'coworking',
  startdate date NOT NULL,
  enddate date NOT NULL,
  occupants integer NOT NULL DEFAULT 1,
  subscriptiontype text NOT NULL DEFAULT 'daily',
  amount numeric NOT NULL DEFAULT 0,
  paymentmethod text NOT NULL DEFAULT 'cash',
  transactionid text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  createdat timestamptz NOT NULL DEFAULT now(),
  updatedat timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
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

-- Create RPC function for reservation creation
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
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO public;