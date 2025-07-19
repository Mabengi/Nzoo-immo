import { useState, useEffect } from 'react'
import { supabase, type Space } from '../lib/supabase'

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpaces = async () => {
    try {
      setLoading(true)
      setError(null);
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setSpaces(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des espaces';
      setError(errorMessage);
      console.error('Erreur fetchSpaces:', err);
      // En cas d'erreur, on garde les espaces existants plutôt que de tout vider
    } finally {
      setLoading(false)
    }
  }

  const createSpace = async (spaceData: Omit<Space, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Création d\'un espace:', spaceData);
      const { data, error } = await supabase
        .from('spaces')
        .insert([spaceData])
        .select()
        .single()

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchSpaces()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'espace';
      console.error('Erreur createSpace:', err);
      throw new Error(errorMessage);
    }
  }

  const updateSpace = async (id: string, spaceData: Partial<Space>) => {
    try {
      const { error } = await supabase
        .from('spaces')
        .update(spaceData)
        .eq('id', id)

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchSpaces()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  const deleteSpace = async (id: string) => {
    try {
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchSpaces()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    }
  }

  useEffect(() => {
    fetchSpaces()
  }, [])

  return {
    spaces,
    loading,
    error,
    createSpace,
    updateSpace,
    deleteSpace,
    refetch: fetchSpaces
  }
}