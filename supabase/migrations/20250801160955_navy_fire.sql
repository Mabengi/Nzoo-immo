/*
  # Fix reservation permissions for modifications and deletions

  1. Add missing RLS policies for UPDATE and DELETE operations
  2. Create RPC functions for secure updates and deletions
  3. Grant proper permissions to authenticated users

  This migration fixes the issue where reservation modifications are not saved.
*/

-- Enable RLS on reservations table
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "allow_all_operations" ON reservations;
DROP POLICY IF EXISTS "allow_all_inserts" ON reservations;
DROP POLICY IF EXISTS "allow_authenticated_select" ON reservations;
DROP POLICY IF EXISTS "allow_anon_insert" ON reservations;

-- Create comprehensive policies for all operations
CREATE POLICY "reservations_insert_policy"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "reservations_select_policy"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "reservations_update_policy"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "reservations_delete_policy"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RPC function for updating reservations
CREATE OR REPLACE FUNCTION update_reservation_admin(
  reservation_id uuid,
  reservation_data jsonb
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  updated_reservation record;
  result jsonb;
  update_sql text;
  fullname_col text;
  spacetype_col text;
  startdate_col text;
  enddate_col text;
  subscriptiontype_col text;
  paymentmethod_col text;
  transactionid_col text;
  updatedat_col text;
BEGIN
  -- Log the input data
  RAISE NOTICE 'Updating reservation % with data: %', reservation_id, reservation_data;

  -- Determine which column names to use based on what exists
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'fullname') 
    THEN 'fullname' 
    ELSE 'full_name' 
  END INTO fullname_col;
  
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'spacetype') 
    THEN 'spacetype' 
    ELSE 'space_type' 
  END INTO spacetype_col;
  
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'startdate') 
    THEN 'startdate' 
    ELSE 'start_date' 
  END INTO startdate_col;
  
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'enddate') 
    THEN 'enddate' 
    ELSE 'end_date' 
  END INTO enddate_col;
  
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'subscriptiontype') 
    THEN 'subscriptiontype' 
    ELSE 'subscription_type' 
  END INTO subscriptiontype_col;
  
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'paymentmethod') 
    THEN 'paymentmethod' 
    ELSE 'payment_method' 
  END INTO paymentmethod_col;
  
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'transactionid') 
    THEN 'transactionid' 
    ELSE 'transaction_id' 
  END INTO transactionid_col;
  
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'updatedat') 
    THEN 'updatedat' 
    ELSE 'updated_at' 
  END INTO updatedat_col;

  -- Build dynamic UPDATE SQL
  update_sql := format('
    UPDATE reservations SET
      %I = COALESCE($2, %I),
      email = COALESCE($3, email),
      phone = COALESCE($4, phone),
      company = $5,
      activity = COALESCE($6, activity),
      address = $7,
      %I = COALESCE($8, %I),
      %I = COALESCE($9, %I),
      %I = COALESCE($10, %I),
      occupants = COALESCE($11, occupants),
      %I = COALESCE($12, %I),
      amount = COALESCE($13, amount),
      %I = COALESCE($14, %I),
      %I = COALESCE($15, %I),
      status = COALESCE($16, status),
      %I = now()
    WHERE id = $1
    RETURNING *',
    fullname_col, fullname_col,
    spacetype_col, spacetype_col,
    startdate_col, startdate_col,
    enddate_col, enddate_col,
    subscriptiontype_col, subscriptiontype_col,
    paymentmethod_col, paymentmethod_col,
    transactionid_col, transactionid_col,
    updatedat_col
  );

  -- Execute the dynamic SQL
  EXECUTE update_sql
  USING 
    reservation_id,
    NULLIF(TRIM(reservation_data->>'full_name'), ''),
    NULLIF(TRIM(reservation_data->>'email'), ''),
    NULLIF(TRIM(reservation_data->>'phone'), ''),
    NULLIF(TRIM(reservation_data->>'company'), ''),
    NULLIF(TRIM(reservation_data->>'activity'), ''),
    NULLIF(TRIM(reservation_data->>'address'), ''),
    NULLIF(TRIM(reservation_data->>'space_type'), ''),
    (reservation_data->>'start_date')::date,
    (reservation_data->>'end_date')::date,
    (reservation_data->>'occupants')::integer,
    NULLIF(TRIM(reservation_data->>'subscription_type'), ''),
    (reservation_data->>'amount')::numeric,
    NULLIF(TRIM(reservation_data->>'payment_method'), ''),
    NULLIF(TRIM(reservation_data->>'transaction_id'), ''),
    NULLIF(TRIM(reservation_data->>'status'), '')
  INTO updated_reservation;

  -- Check if any row was updated
  IF updated_reservation IS NULL THEN
    RAISE EXCEPTION 'Reservation with ID % not found', reservation_id;
  END IF;

  -- Log the updated reservation
  RAISE NOTICE 'Updated reservation with ID: %', updated_reservation.id;

  -- Return the updated reservation as JSON
  SELECT to_jsonb(updated_reservation) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error updating reservation: % - %', SQLSTATE, SQLERRM;
    RAISE EXCEPTION 'Failed to update reservation: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Create RPC function for deleting reservations
CREATE OR REPLACE FUNCTION delete_reservation_admin(reservation_id uuid)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_reservation record;
  result jsonb;
BEGIN
  -- Log the operation
  RAISE NOTICE 'Deleting reservation with ID: %', reservation_id;

  -- Delete the reservation
  DELETE FROM reservations 
  WHERE id = reservation_id
  RETURNING * INTO deleted_reservation;

  -- Check if any row was deleted
  IF deleted_reservation IS NULL THEN
    RAISE EXCEPTION 'Reservation with ID % not found', reservation_id;
  END IF;

  -- Log the deleted reservation
  RAISE NOTICE 'Deleted reservation with ID: %', deleted_reservation.id;

  -- Return the deleted reservation as JSON
  SELECT to_jsonb(deleted_reservation) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting reservation: % - %', SQLSTATE, SQLERRM;
    RAISE EXCEPTION 'Failed to delete reservation: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Grant execute permissions for the new functions
GRANT EXECUTE ON FUNCTION update_reservation_admin(uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_reservation_admin(uuid, jsonb) TO anon;
GRANT EXECUTE ON FUNCTION update_reservation_admin(uuid, jsonb) TO public;

GRANT EXECUTE ON FUNCTION delete_reservation_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_reservation_admin(uuid) TO anon;
GRANT EXECUTE ON FUNCTION delete_reservation_admin(uuid) TO public;

-- Add comments
COMMENT ON FUNCTION update_reservation_admin(uuid, jsonb) IS 'Updates a reservation with elevated privileges, bypassing RLS';
COMMENT ON FUNCTION delete_reservation_admin(uuid) IS 'Deletes a reservation with elevated privileges, bypassing RLS';