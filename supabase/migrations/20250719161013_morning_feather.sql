/*
  # Correction des permissions RLS pour la table reservations

  1. Permissions
    - Accorder les permissions INSERT, SELECT, UPDATE à 'anon'
    - Accorder toutes les permissions à 'authenticated'
    
  2. Politiques RLS
    - Permettre à tous (anon et authenticated) d'insérer des réservations
    - Permettre à tous de lire les réservations
    - Permettre aux utilisateurs authentifiés de modifier
    
  3. Sécurité
    - Maintenir RLS activé
    - Politiques permissives pour les réservations publiques
*/

-- Accorder les permissions de base au rôle anon
GRANT INSERT, SELECT ON public.reservations TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.reservations TO authenticated;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow public insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow public read reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.reservations;

-- Créer des politiques RLS permissives
CREATE POLICY "Allow public insert reservations"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read reservations"
  ON public.reservations
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON public.reservations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- S'assurer que RLS est activé
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;