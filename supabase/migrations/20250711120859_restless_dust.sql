/*
  # Schéma initial pour l'application Nzoo Immo

  1. Nouvelles tables
    - `spaces` - Gestion des espaces disponibles
    - `reservations` - Gestion des réservations
    - `payments` - Suivi des paiements
    - `notifications` - Système de notifications

  2. Sécurité
    - Activation de RLS sur toutes les tables
    - Politiques d'accès appropriées pour chaque table
*/

-- Table des espaces
CREATE TABLE IF NOT EXISTS spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('coworking', 'bureau-prive', 'salle-reunion')),
  description text,
  features text[] DEFAULT '{}',
  max_occupants integer NOT NULL DEFAULT 1,
  daily_price decimal(10,2),
  monthly_price decimal(10,2),
  yearly_price decimal(10,2),
  hourly_price decimal(10,2),
  is_active boolean DEFAULT true,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  activity text NOT NULL,
  address text,
  space_type text NOT NULL CHECK (space_type IN ('coworking', 'bureau-prive', 'salle-reunion')),
  space_id uuid REFERENCES spaces(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  occupants integer NOT NULL DEFAULT 1,
  subscription_type text CHECK (subscription_type IN ('daily', 'monthly', 'yearly', 'hourly')),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_method text CHECK (payment_method IN ('mobile_money', 'visa')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  method text NOT NULL CHECK (method IN ('mobile_money', 'visa')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('reservation_created', 'payment_received', 'reminder', 'cancellation')),
  recipient_email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  sent_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Activation de RLS
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour les espaces (lecture publique)
CREATE POLICY "Espaces visibles publiquement"
  ON spaces
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin peut gérer les espaces"
  ON spaces
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les réservations
CREATE POLICY "Utilisateurs peuvent créer des réservations"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin peut voir toutes les réservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin peut modifier les réservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les paiements
CREATE POLICY "Admin peut gérer les paiements"
  ON payments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les notifications
CREATE POLICY "Admin peut gérer les notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Insertion des espaces par défaut
INSERT INTO spaces (name, type, description, features, max_occupants, daily_price, monthly_price, yearly_price, images) VALUES
('Coworking Space A', 'coworking', 'Espace de travail partagé moderne et équipé', 
 ARRAY['WiFi Haut Débit', 'Café/Thé Gratuit', 'Imprimante', 'Salle de Réunion'], 
 3, 15.00, 300.00, 3000.00, 
 ARRAY['/WhatsApp Image 2025-07-11 à 10.17.26_243d1eea.jpg', '/WhatsApp Image 2025-07-11 à 10.17.26_8630001d.jpg']),

('Bureau Privé Premium', 'bureau-prive', 'Bureau privé entièrement équipé pour votre équipe', 
 ARRAY['Bureau Privé', 'WiFi Dédié', 'Parking', 'Sécurité 24/7'], 
 10, NULL, 500.00, 5500.00, 
 ARRAY['/WhatsApp Image 2025-07-11 à 10.17.27_3a034c36.jpg', '/WhatsApp Image 2025-07-11 à 10.17.28_134798d1.jpg']),

('Salle de Réunion Executive', 'salle-reunion', 'Salle moderne pour vos réunions professionnelles', 
 ARRAY['Écran de Présentation', 'Système Audio', 'WiFi', 'Climatisation'], 
 12, NULL, NULL, NULL, 
 ARRAY['/WhatsApp Image 2025-07-11 à 10.17.28_c20d6202.jpg', '/WhatsApp Image 2025-07-11 à 10.17.28_674bbb31.jpg']);

-- Mise à jour du prix horaire pour les salles de réunion
UPDATE spaces SET hourly_price = 25.00 WHERE type = 'salle-reunion';