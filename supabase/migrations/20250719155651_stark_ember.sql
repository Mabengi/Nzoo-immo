/*
  # Ajout de la colonne amount manquante

  1. Modifications
    - Ajouter la colonne `amount` à la table `reservations`
    - Ajouter la colonne `payment_method` avec les bonnes valeurs autorisées

  2. Sécurité
    - Maintien des politiques RLS existantes
*/

-- Ajouter la colonne amount si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'amount'
  ) THEN
    ALTER TABLE reservations ADD COLUMN amount decimal(10,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Mettre à jour la contrainte payment_method pour inclure 'cash'
DO $$
BEGIN
  -- Supprimer l'ancienne contrainte si elle existe
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reservations_payment_method_check' 
    AND table_name = 'reservations'
  ) THEN
    ALTER TABLE reservations DROP CONSTRAINT reservations_payment_method_check;
  END IF;
  
  -- Ajouter la nouvelle contrainte avec 'cash'
  ALTER TABLE reservations ADD CONSTRAINT reservations_payment_method_check 
    CHECK (payment_method IN ('mobile_money', 'visa', 'cash'));
END $$;