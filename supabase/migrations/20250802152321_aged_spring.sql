/*
  # Create complete database schema with correct SQL syntax

  1. New Tables
    - reservations - Gestion des réservations d'espaces
    - admin_users - Utilisateurs administrateurs
    - spaces - Gestion des espaces disponibles
    - clients - Informations des clients
    - payments - Historique des paiements

  2. Security
    - Disable RLS on all tables for simplicity
    - Create RPC functions for secure operations
    - Grant proper permissions

  3. Test Data
    - Insert sample data for testing
*/

-- =====================================================
-- 1. TABLE: reservations
-- =====================================================

-- Create reservations table with correct structure
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  activity text NOT NULL,
  address text,
  space_type text NOT NULL DEFAULT 'coworking',
  start_date date NOT NULL,
  end_date date NOT NULL,
  occupants integer NOT NULL DEFAULT 1,
  subscription_type text NOT NULL DEFAULT 'daily',
  amount numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash',
  transaction_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS on reservations
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. TABLE: admin_users
-- =====================================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  full_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS on admin_users
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. TABLE: spaces
-- =====================================================

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'coworking',
  description text NOT NULL,
  features text[] DEFAULT '{}',
  max_occupants integer NOT NULL DEFAULT 1,
  daily_price numeric DEFAULT 0,
  monthly_price numeric DEFAULT 0,
  yearly_price numeric DEFAULT 0,
  hourly_price numeric DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  images text[] DEFAULT '{}',
  availability_status text NOT NULL DEFAULT 'available',
  display_order integer DEFAULT 0,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS on spaces
ALTER TABLE spaces DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. TABLE: clients
-- =====================================================

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  company text,
  activity text,
  address text,
  total_reservations integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  last_reservation_date timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS on clients
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. TABLE: payments
-- =====================================================

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  transaction_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_date timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS on payments
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- RPC FUNCTIONS
-- =====================================================

-- Drop existing functions
DROP FUNCTION IF EXISTS create_reservation_admin(jsonb);
DROP FUNCTION IF EXISTS update_reservation_admin(uuid, jsonb);
DROP FUNCTION IF EXISTS delete_reservation_admin(uuid);

-- Create RPC function for creating reservations
CREATE OR REPLACE FUNCTION create_reservation_admin(reservation_data jsonb)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_reservation record;
  result jsonb;
BEGIN
  RAISE NOTICE 'Creating reservation with data: %', reservation_data;

  INSERT INTO reservations (
    full_name,
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
    COALESCE(reservation_data->>'full_name', ''),
    COALESCE(reservation_data->>'email', ''),
    COALESCE(reservation_data->>'phone', ''),
    reservation_data->>'company',
    COALESCE(reservation_data->>'activity', ''),
    reservation_data->>'address',
    COALESCE(reservation_data->>'space_type', 'coworking'),
    (reservation_data->>'start_date')::date,
    (reservation_data->>'end_date')::date,
    COALESCE((reservation_data->>'occupants')::integer, 1),
    COALESCE(reservation_data->>'subscription_type', 'daily'),
    COALESCE((reservation_data->>'amount')::numeric, 0),
    COALESCE(reservation_data->>'payment_method', 'cash'),
    COALESCE(reservation_data->>'transaction_id', ''),
    COALESCE(reservation_data->>'status', 'pending'),
    COALESCE((reservation_data->>'created_at')::timestamptz, now())
  )
  RETURNING * INTO new_reservation;

  RAISE NOTICE 'Created reservation with ID: %', new_reservation.id;
  
  SELECT to_jsonb(new_reservation) INTO result;
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating reservation: %', SQLERRM;
    RAISE EXCEPTION 'Failed to create reservation: %', SQLERRM;
END;
$$;

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
BEGIN
  RAISE NOTICE 'Updating reservation % with data: %', reservation_id, reservation_data;

  UPDATE reservations SET
    full_name = COALESCE(reservation_data->>'full_name', full_name),
    email = COALESCE(reservation_data->>'email', email),
    phone = COALESCE(reservation_data->>'phone', phone),
    company = COALESCE(reservation_data->>'company', company),
    activity = COALESCE(reservation_data->>'activity', activity),
    address = COALESCE(reservation_data->>'address', address),
    space_type = COALESCE(reservation_data->>'space_type', space_type),
    start_date = COALESCE((reservation_data->>'start_date')::date, start_date),
    end_date = COALESCE((reservation_data->>'end_date')::date, end_date),
    occupants = COALESCE((reservation_data->>'occupants')::integer, occupants),
    subscription_type = COALESCE(reservation_data->>'subscription_type', subscription_type),
    amount = COALESCE((reservation_data->>'amount')::numeric, amount),
    payment_method = COALESCE(reservation_data->>'payment_method', payment_method),
    transaction_id = COALESCE(reservation_data->>'transaction_id', transaction_id),
    status = COALESCE(reservation_data->>'status', status),
    notes = COALESCE(reservation_data->>'notes', notes),
    admin_notes = COALESCE(reservation_data->>'admin_notes', admin_notes),
    updated_at = now()
  WHERE id = reservation_id
  RETURNING * INTO updated_reservation;

  IF updated_reservation IS NULL THEN
    RAISE EXCEPTION 'Reservation with ID % not found', reservation_id;
  END IF;

  RAISE NOTICE 'Updated reservation with ID: %', updated_reservation.id;
  
  SELECT to_jsonb(updated_reservation) INTO result;
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error updating reservation: %', SQLERRM;
    RAISE EXCEPTION 'Failed to update reservation: %', SQLERRM;
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
  RAISE NOTICE 'Deleting reservation with ID: %', reservation_id;

  DELETE FROM reservations 
  WHERE id = reservation_id
  RETURNING * INTO deleted_reservation;

  IF deleted_reservation IS NULL THEN
    RAISE EXCEPTION 'Reservation with ID % not found', reservation_id;
  END IF;

  RAISE NOTICE 'Deleted reservation with ID: %', deleted_reservation.id;
  
  SELECT to_jsonb(deleted_reservation) INTO result;
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting reservation: %', SQLERRM;
    RAISE EXCEPTION 'Failed to delete reservation: %', SQLERRM;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION create_reservation_admin(jsonb) TO public;

GRANT EXECUTE ON FUNCTION update_reservation_admin(uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_reservation_admin(uuid, jsonb) TO anon;
GRANT EXECUTE ON FUNCTION update_reservation_admin(uuid, jsonb) TO public;

GRANT EXECUTE ON FUNCTION delete_reservation_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_reservation_admin(uuid) TO anon;
GRANT EXECUTE ON FUNCTION delete_reservation_admin(uuid) TO public;

-- =====================================================
-- INSERT TEST DATA
-- =====================================================

-- Insert admin user
INSERT INTO admin_users (username, email, password_hash, role, full_name)
VALUES ('admin', 'admin@nzooimmo.com', 'admin123', 'admin', 'Administrateur')
ON CONFLICT (username) DO NOTHING;

-- Insert sample spaces
INSERT INTO spaces (name, type, description, features, max_occupants, daily_price, monthly_price, yearly_price)
VALUES 
  ('Espace Coworking Principal', 'coworking', 'Espace de travail partagé moderne et convivial', 
   ARRAY['WiFi haut débit', 'Climatisation', 'Café gratuit', 'Imprimante'], 50, 25, 500, 5000),
  ('Bureau Privé Premium', 'bureau-prive', 'Bureau privé entièrement équipé', 
   ARRAY['Bureau fermé', 'WiFi dédié', 'Mobilier complet', 'Ligne téléphonique'], 10, NULL, 1200, 12000),
  ('Service Domiciliation', 'domiciliation', 'Service de domiciliation commerciale', 
   ARRAY['Adresse prestigieuse', 'Réception courrier', 'Transfert appels'], 1, NULL, 300, 3000)
ON CONFLICT DO NOTHING;

-- Insert sample reservations
INSERT INTO reservations (
  full_name, email, phone, company, activity, space_type, 
  start_date, end_date, occupants, subscription_type, 
  amount, payment_method, transaction_id, status
) VALUES 
  ('Jean Dupont', 'jean@example.com', '+243123456789', 'Tech Corp', 'Développement', 'coworking', 
   CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 2, 'daily', 175, 'cash', 'TEST_001', 'confirmed'),
  ('Marie Martin', 'marie@example.com', '+243987654321', 'Design Studio', 'Design', 'bureau-prive', 
   CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '30 days', 5, 'monthly', 1200, 'orange_money', 'TEST_002', 'pending'),
  ('Paul Durand', 'paul@example.com', '+243555666777', 'Consulting', 'Conseil', 'coworking', 
   CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '1 day', 1, 'daily', 100, 'visa', 'TEST_003', 'completed'),
  ('Sophie Bernard', 'sophie@example.com', '+243444555666', 'StartupCo', 'Innovation', 'domiciliation', 
   CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days', 1, 'yearly', 3000, 'cash', 'TEST_004', 'confirmed')
ON CONFLICT DO NOTHING;

-- Insert sample clients (derived from reservations)
INSERT INTO clients (full_name, email, phone, company, activity, total_reservations, total_spent, last_reservation_date)
VALUES 
  ('Jean Dupont', 'jean@example.com', '+243123456789', 'Tech Corp', 'Développement', 1, 175, CURRENT_DATE),
  ('Marie Martin', 'marie@example.com', '+243987654321', 'Design Studio', 'Design', 1, 1200, CURRENT_DATE + INTERVAL '1 day'),
  ('Paul Durand', 'paul@example.com', '+243555666777', 'Consulting', 'Conseil', 1, 100, CURRENT_DATE - INTERVAL '5 days'),
  ('Sophie Bernard', 'sophie@example.com', '+243444555666', 'StartupCo', 'Innovation', 1, 3000, CURRENT_DATE)
ON CONFLICT (email) DO NOTHING;

-- Insert sample payments
INSERT INTO payments (reservation_id, amount, payment_method, transaction_id, status, payment_date)
SELECT 
  r.id,
  r.amount,
  r.payment_method,
  r.transaction_id,
  CASE WHEN r.status = 'confirmed' OR r.status = 'completed' THEN 'completed' ELSE 'pending' END,
  CASE WHEN r.status = 'confirmed' OR r.status = 'completed' THEN r.created_at ELSE NULL END
FROM reservations r
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE reservations IS 'Table des réservations d''espaces de travail';
COMMENT ON TABLE admin_users IS 'Table des utilisateurs administrateurs';
COMMENT ON TABLE spaces IS 'Table des espaces disponibles à la réservation';
COMMENT ON TABLE clients IS 'Table des informations clients';
COMMENT ON TABLE payments IS 'Table de l''historique des paiements';

COMMENT ON FUNCTION create_reservation_admin(jsonb) IS 'Crée une réservation avec privilèges élevés';
COMMENT ON FUNCTION update_reservation_admin(uuid, jsonb) IS 'Met à jour une réservation avec privilèges élevés';
COMMENT ON FUNCTION delete_reservation_admin(uuid) IS 'Supprime une réservation avec privilèges élevés';