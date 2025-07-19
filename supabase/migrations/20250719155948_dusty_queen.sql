/*
  # Ajouter la colonne payment_status manquante

  1. Nouvelles colonnes
    - `payment_status` (text) - Statut du paiement avec valeurs contrôlées
  
  2. Contraintes
    - Ajouter une contrainte CHECK pour payment_status
    - Valeurs autorisées: 'pending', 'completed', 'failed', 'cancelled'
*/

-- Ajouter la colonne payment_status
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

-- Ajouter une contrainte pour payment_status
ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_payment_status_check;
ALTER TABLE reservations ADD CONSTRAINT reservations_payment_status_check 
  CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled'));