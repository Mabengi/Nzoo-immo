import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export interface Reservation {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company?: string;
  activity?: string;
  space_type: string;
  start_date: string;
  end_date: string;
  occupants: number;
  amount: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching reservations from Supabase...');
      
      // Test de connexion à Supabase
      const { data: testConnection, error: connectionError } = await supabase
        .from('reservations')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        console.error('❌ Connection error:', connectionError);
        
        // Check if it's a connection error due to missing environment variables
        if (connectionError.message.includes('Invalid API key') || connectionError.message.includes('fetch')) {
          throw new Error('Connexion Supabase non configurée. Veuillez cliquer sur "Connect to Supabase" en haut à droite.');
        }
        
        throw new Error(`Erreur de connexion: ${connectionError.message}`);
      }
      
      console.log('✅ Supabase connection successful');
      
      // Récupérer toutes les réservations
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('✅ Raw data from Supabase:', data?.length || 0, 'reservations found');
      console.log('📊 Sample data:', data?.[0]);
      
      // Vérifier si on a des données
      if (!data || data.length === 0) {
        console.log('⚠️ No reservations found in database');
        setReservations([]);
        return;
      }
      
      // Mapper les données avec gestion flexible des noms de colonnes
      const mappedData = (data || []).map(item => {
        console.log('🔄 Mapping item:', item.id);
        return {
          id: item.id,
          full_name: item.full_name || item.fullname || '',
          email: item.email || '',
          phone: item.phone || '',
          company: item.company || '',
          activity: item.activity || '',
          space_type: item.space_type || item.spacetype || 'coworking',
          start_date: item.start_date || item.startdate || new Date().toISOString().split('T')[0],
          end_date: item.end_date || item.enddate || new Date().toISOString().split('T')[0],
          occupants: item.occupants || 1,
          amount: item.amount || 0,
          payment_method: item.payment_method || item.paymentmethod || 'cash',
          status: item.status || 'pending',
          notes: item.notes || '',
          admin_notes: item.admin_notes || '',
          created_at: item.created_at || item.createdat || new Date().toISOString(),
          updated_at: item.updated_at || item.updatedat || new Date().toISOString()
        };
      });
      
      console.log('✅ Mapped reservations:', mappedData);
      setReservations(mappedData);
    } catch (err) {
      console.error('❌ Error fetching reservations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des réservations';
      setError(errorMessage);
      
      // En cas d'erreur, essayer de diagnostiquer
      console.log('🔍 Diagnostic: Checking Supabase configuration...');
      console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
      console.log('🔍 Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      console.log('🔄 Updating reservation status:', { id, status });
      
      // Use RPC function for status updates
      const { data, error } = await supabase.rpc('update_reservation_admin', {
        reservation_id: id,
        reservation_data: { status }
      });

      if (error) throw error;
      
      console.log('✅ Status updated successfully');
      // Refresh reservations
      await fetchReservations();
    } catch (err) {
      console.error('❌ Error updating status:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut');
    }
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    try {
      console.log('🔄 Updating reservation:', { id, updates });
      
      // Use RPC function for updates with elevated privileges
      const { data, error } = await supabase.rpc('update_reservation_admin', {
        reservation_id: id,
        reservation_data: updates
      });

      if (error) throw error;
      
      console.log('✅ Reservation updated successfully');
      // Refresh reservations
      await fetchReservations();
    } catch (err) {
      console.error('❌ Error updating reservation:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la réservation');
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      console.log('🗑️ Deleting reservation:', id);
      
      // Use RPC function for deletion with elevated privileges
      const { data, error } = await supabase.rpc('delete_reservation_admin', {
        reservation_id: id
      });

      if (error) throw error;
      
      console.log('✅ Reservation deleted successfully');
      // Refresh reservations
      await fetchReservations();
    } catch (err) {
      console.error('❌ Error deleting reservation:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression de la réservation');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    error,
    updateReservationStatus,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations
  };
};