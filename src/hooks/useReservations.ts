import { useState, useEffect } from 'react'
import { supabase, type Reservation } from '../lib/supabase'

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservation])
        .select()
        .single()

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchReservations()
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
  }

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchReservations()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservationStatus,
    refetch: fetchReservations
  }
}