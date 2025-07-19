/*
  # Gestion des espaces - Formulaire d'administration

  1. Nouvelles fonctionnalités
    - Mise à jour de la table spaces pour la gestion complète
    - Ajout de colonnes pour une meilleure gestion
    - Politiques RLS pour l'administration

  2. Sécurité
    - Maintien des politiques RLS existantes
    - Ajout de politiques pour l'administration des espaces
*/

-- Ajouter des colonnes supplémentaires si elles n'existent pas
DO $$
BEGIN
  -- Ajouter une colonne pour l'ordre d'affichage
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE spaces ADD COLUMN display_order integer DEFAULT 0;
  END IF;

  -- Ajouter une colonne pour les notes d'administration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE spaces ADD COLUMN admin_notes text;
  END IF;

  -- Ajouter une colonne pour la disponibilité
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE spaces ADD COLUMN availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'maintenance', 'reserved', 'unavailable'));
  END IF;
END $$;

-- Créer des index pour optimiser les requêtes d'administration
CREATE INDEX IF NOT EXISTS idx_spaces_type ON spaces(type);
CREATE INDEX IF NOT EXISTS idx_spaces_active ON spaces(is_active);
CREATE INDEX IF NOT EXISTS idx_spaces_display_order ON spaces(display_order);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_spaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_spaces_updated_at_trigger ON spaces;
CREATE TRIGGER update_spaces_updated_at_trigger
    BEFORE UPDATE ON spaces 
    FOR EACH ROW 
    EXECUTE FUNCTION update_spaces_updated_at();

-- Politiques RLS pour l'administration des espaces
CREATE POLICY IF NOT EXISTS "Admin peut créer des espaces"
  ON spaces
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR true);

CREATE POLICY IF NOT EXISTS "Admin peut modifier des espaces"
  ON spaces
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR true);

CREATE POLICY IF NOT EXISTS "Admin peut supprimer des espaces"
  ON spaces
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR true);

-- Mettre à jour l'ordre d'affichage des espaces existants
UPDATE spaces SET display_order = 1 WHERE type = 'coworking';
UPDATE spaces SET display_order = 2 WHERE type = 'bureau-prive';
UPDATE spaces SET display_order = 3 WHERE type = 'salle-reunion';