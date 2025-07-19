import { supabase } from '../lib/supabase';
import { sendReservationConfirmationEmail } from './emailService';

export interface ReservationData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  activity: string;
  address?: string;
  spaceType: string;
  startDate: string;
  endDate: string;
  occupants: number;
  subscriptionType: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

export const createReservation = async (data: ReservationData) => {
  try {
    // Créer la réservation dans Supabase
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          activity: data.activity,
          address: data.address || null,
          space_type: data.spaceType,
          start_date: data.startDate,
          end_date: data.endDate,
          occupants: data.occupants,
          subscription_type: data.subscriptionType,
          amount: data.amount,
          status: data.paymentMethod === 'cash' ? 'confirmed' : 'pending',
          payment_status: data.paymentMethod === 'cash' ? 'pending' : 'pending',
          payment_method: data.paymentMethod,
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la réservation: ${error.message}`);
    }

    // Envoyer l'email de confirmation
    const emailSent = await sendReservationConfirmationEmail({
      to_email: data.email,
      to_name: data.fullName,
      reservation_id: reservation.id,
      space_type: data.spaceType,
      start_date: data.startDate,
      end_date: data.endDate,
      amount: data.amount,
      payment_method: data.paymentMethod,
      company: data.company,
      activity: data.activity,
      occupants: data.occupants,
    });

    if (!emailSent) {
      console.warn('Email de confirmation non envoyé, mais réservation créée');
    }

    return {
      success: true,
      reservation,
      emailSent,
    };
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    throw error;
  }
};