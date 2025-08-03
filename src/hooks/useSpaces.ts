import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export interface Space {
  id: string;
  name: string;
  type: 'coworking' | 'bureau-prive' | 'salle-reunion';
  description: string;
  features: string[];
  max_occupants: number;
  daily_price?: number;
  monthly_price?: number;
  yearly_price?: number;
  hourly_price?: number;
  is_active: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
}

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on utilise des données mockées car la table spaces n'existe pas encore
      const mockSpaces: Space[] = [
        {
          id: '1',
          name: 'Espace Coworking',
          type: 'coworking',
          description: 'Espace de travail partagé moderne et convivial',
          features: ['WiFi haut débit', 'Climatisation', 'Café gratuit'],
          max_occupants: 50,
          daily_price: 25,
          monthly_price: 500,
          yearly_price: 5000,
          is_active: true,
          images: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Bureau Privé',
          type: 'bureau-prive',
          description: 'Bureau privé entièrement équipé',
          features: ['Bureau fermé', 'WiFi dédié', 'Mobilier complet'],
          max_occupants: 10,
          monthly_price: 1200,
          yearly_price: 12000,
          is_active: true,
          images: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setSpaces(mockSpaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des espaces');
    } finally {
      setLoading(false);
    }
  };

  const createSpace = async (spaceData: Omit<Space, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSpace: Space = {
        ...spaceData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setSpaces(prev => [newSpace, ...prev]);
      return newSpace;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création de l\'espace');
    }
  };

  const updateSpace = async (id: string, updates: Partial<Space>) => {
    try {
      setSpaces(prev => 
        prev.map(space => 
          space.id === id 
            ? { ...space, ...updates, updated_at: new Date().toISOString() }
            : space
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'espace');
    }
  };

  const deleteSpace = async (id: string) => {
    try {
      setSpaces(prev => prev.filter(space => space.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'espace');
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return {
    spaces,
    loading,
    error,
    createSpace,
    updateSpace,
    deleteSpace,
    refetch: fetchSpaces
  };
};