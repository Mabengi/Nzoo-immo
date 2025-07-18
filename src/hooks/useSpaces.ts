import { useState, useEffect } from 'react'
import { supabase, type Space } from '../lib/supabase'

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpaces = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setSpaces(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpaces()
  }, [])

  return {
    spaces,
    loading,
    error,
    refetch: fetchSpaces
  }
}