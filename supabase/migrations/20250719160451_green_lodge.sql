-- Script de création de la table reservations
-- À exécuter dans le SQL Editor de Supabase

-- Supprimer la table existante si elle existe (ATTENTION: supprime toutes les données)
DROP TABLE IF EXISTS reservations CASCADE;

-- Créer la nouvelle table reservations avec tous les champs
CREATE TABLE reservations (
  -- Identifiant unique
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations client (obligatoires)
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  activity text NOT NULL,
  
  -- Informations client (optionnelles)
  company text,
  address text,
  
  -- Détails de la réservation
  space_type text NOT NULL CHECK (space_type IN ('coworking', 'bureau-prive', 'salle-reunion')),
  space_id uuid,
  start_date date NOT NULL,
  end_date date NOT NULL,
  occupants integer NOT NULL DEFAULT 1,
  subscription_type text CHECK (subscription_type IN ('daily', 'monthly', 'yearly', 'hourly')),
  
  -- Informations financières
  amount decimal(10,2) NOT NULL DEFAULT 0,
  payment_method text CHECK (payment_method IN ('mobile_money', 'visa', 'cash')),
  transaction_id text,
  payment_date timestamptz,
  
  -- Statuts
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled')),
  
  -- Métadonnées
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Notes
  notes text,
  admin_notes text
);

-- Créer des index pour optimiser les performances
CREATE INDEX idx_reservations_dates ON reservations(start_date, end_date);
CREATE INDEX idx_reservations_email ON reservations(email);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_space_type ON reservations(space_type);
CREATE INDEX idx_reservations_created_at ON reservations(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour permettre l'accès approprié

-- Permettre à tout le monde de créer des réservations (clients anonymes)
CREATE POLICY "Permettre création de réservations"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permettre aux utilisateurs authentifiés de voir toutes les réservations (admin)
CREATE POLICY "Admin peut voir toutes les réservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

-- Permettre aux utilisateurs authentifiés de modifier les réservations (admin)
CREATE POLICY "Admin peut modifier les réservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Permettre aux utilisateurs authentifiés de supprimer les réservations (admin)
CREATE POLICY "Admin peut supprimer les réservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (true);

-- Insérer quelques données de test (optionnel)
INSERT INTO reservations (
  full_name, 
  email, 
  phone, 
  company, 
  activity, 
  space_type, 
  start_date, 
  end_date, 
  occupants, 
  subscription_type, 
  amount, 
  status, 
  payment_status, 
  payment_method,
  transaction_id
) VALUES 
(
  'Jean Dupont', 
  'jean.dupont@example.com', 
  '+243123456789', 
  'Tech Solutions', 
  'Développement Web', 
  'coworking', 
  CURRENT_DATE + INTERVAL '1 day', 
  CURRENT_DATE + INTERVAL '5 days', 
  2, 
  'daily', 
  60.00, 
  'confirmed', 
  'paid', 
  'mobile_money',
  'TEST_001'
),
(
  'Marie Martin', 
  'marie.martin@example.com', 
  '+243987654321', 
  'Business Corp', 
  'Consulting', 
  'bureau-prive', 
  CURRENT_DATE + INTERVAL '7 days', 
  CURRENT_DATE + INTERVAL '37 days', 
  5, 
  'monthly', 
  500.00, 
  'pending', 
  'pending', 
  'cash',
  'CASH_001'
);

-- Afficher un message de confirmation
SELECT 'Table reservations créée avec succès!' as message;