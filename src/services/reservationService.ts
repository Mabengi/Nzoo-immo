import { supabase } from './supabaseClient';
import { sendConfirmationEmail } from './emailService';

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
  transactionId: string;
}

export interface ReservationResult {
  success: boolean;
  reservation?: any;
  error?: string;
  emailSent?: boolean;
}

export const createReservation = async (data: ReservationData): Promise<ReservationResult> => {
  try {
    console.log('🚀 Creating reservation with original data:', JSON.stringify(data, null, 2));

    // Validation des données avant envoi
    if (!data.startDate || !data.endDate) {
      throw new Error('Les dates de début et de fin sont obligatoires');
    }
    
    if (!data.fullName || !data.email || !data.phone) {
      throw new Error('Le nom, email et téléphone sont obligatoires');
    }

    // Vérification du format des dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Format de date invalide');
    }

    console.log('📅 Date validation passed:', {
      startDate: data.startDate,
      endDate: data.endDate,
      startDateParsed: startDate.toISOString(),
      endDateParsed: endDate.toISOString()
    });
    
    // Préparer les données pour la fonction RPC
    // Mapper correctement les propriétés JavaScript vers les noms de colonnes de la base de données
    const reservationData = {
      full_name: data.fullName || '',  // Mapper fullName -> full_name
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      activity: data.activity,
      address: data.address || null,
      space_type: data.spaceType || 'coworking',  // Mapper spaceType -> space_type
      start_date: data.startDate || new Date().toISOString().split('T')[0],  // Mapper startDate -> start_date
      end_date: data.endDate || new Date().toISOString().split('T')[0],      // Mapper endDate -> end_date
      occupants: data.occupants,
      subscription_type: data.subscriptionType || 'daily',  // Mapper subscriptionType -> subscription_type
      amount: data.amount,
      payment_method: data.paymentMethod || 'cash',  // Mapper paymentMethod -> payment_method
      transaction_id: data.transactionId || `TXN-${Date.now()}`,  // Mapper transactionId -> transaction_id
      status: data.paymentMethod === 'cash' ? 'pending' : 'confirmed',
      created_at: new Date().toISOString()  // Mapper createdAt -> created_at
    };

    console.log('📝 Original form data:', JSON.stringify(data, null, 2));
    console.log('📝 Mapped reservation data for RPC:', JSON.stringify(reservationData, null, 2));
    
    // Validation critique des champs obligatoires
    if (!reservationData.start_date || !reservationData.end_date) {
      throw new Error('Les dates de début et de fin sont obligatoires');
    }
    
    if (!reservationData.full_name || !reservationData.email || !reservationData.phone) {
      throw new Error('Le nom complet, email et téléphone sont obligatoires');
    }

    // Tester d'abord la connexion Supabase
    const { data: testData, error: testError } = await supabase
      .from('reservations')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection test failed:', testError);
      
      // Check if it's a connection error due to missing environment variables
      if (testError.message.includes('Invalid API key') || testError.message.includes('fetch')) {
        throw new Error('Connexion Supabase non configurée. Veuillez cliquer sur "Connect to Supabase" en haut à droite pour configurer la base de données.');
      }
      
      throw new Error(`Erreur de connexion Supabase: ${testError.message}`);
    }
    
    console.log('✅ Supabase connection test passed');
    
    // Insérer directement dans la table reservations
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert(reservationData)
      .select()
      .single();

    if (error) {
      console.error('❌ Insert error:', error);
      throw new Error(`Erreur d'insertion: ${error.message}`);
    }

    if (!reservation) {
      throw new Error('Aucune donnée de réservation retournée par l\'insertion');
    }

    console.log('✅ Reservation created via direct insert:', reservation.id);

    // Envoyer l'email de confirmation
    let emailSent = false;
    try {
      console.log('📧 Sending confirmation email to:', data.email);
      
      const emailResult = await sendConfirmationEmail({
        to: data.email,
        subject: `Confirmation de réservation - ${data.fullName}`,
        reservationData: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          activity: data.activity,
          spaceType: data.spaceType,
          startDate: data.startDate,
          endDate: data.endDate,
          amount: data.amount,
          transactionId: data.transactionId,
          status: reservation.status || 'pending'
        }
      });
      
      emailSent = emailResult.emailSent;
      
      if (emailResult.simulation) {
        console.log('📧 Email simulated (service not configured)');
      } else if (emailSent) {
        console.log('✅ Confirmation email sent successfully');
      } else {
        console.warn('⚠️ Email sending failed:', emailResult.error);
      }
      
    } catch (emailError) {
      console.warn('⚠️ Email sending failed:', emailError);
      emailSent = false;
    }

    return {
      success: true,
      reservation,
      emailSent
    };

  } catch (error) {
    console.error('❌ Error in createReservation:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
      emailSent: false
    };
  }
};

// Alternative function using service role client for bypassing RLS
export const createReservationServiceRole = async (data: ReservationData): Promise<ReservationResult> => {
  try {
    console.log('🚀 Creating reservation with correct column mapping:', JSON.stringify(data, null, 2));

    // Mapper les propriétés JavaScript vers les noms de colonnes de la base de données
    const reservationData = {
      full_name: data.fullName || '',  // Map fullName -> full_name
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      activity: data.activity,
      address: data.address || null,
      space_type: data.spaceType || 'coworking',  // Map spaceType -> space_type
      start_date: data.startDate || new Date().toISOString().split('T')[0],  // Map startDate -> start_date
      end_date: data.endDate || new Date().toISOString().split('T')[0],      // Map endDate -> end_date
      occupants: data.occupants,
      subscription_type: data.subscriptionType || 'daily',  // Map subscriptionType -> subscription_type
      amount: data.amount,
      payment_method: data.paymentMethod || 'cash',  // Map paymentMethod -> payment_method
      transaction_id: data.transactionId || `TXN-${Date.now()}`,  // Map transactionId -> transaction_id
      status: data.paymentMethod === 'cash' ? 'pending' : 'confirmed',
      created_at: new Date().toISOString()  // Map createdAt -> created_at
    };

    console.log('📝 Original form data (ServiceRole):', JSON.stringify(data, null, 2));
    console.log('📝 Mapped reservation data (ServiceRole):', JSON.stringify(reservationData, null, 2));
    
    // Validation critique des champs obligatoires
    if (!reservationData.start_date || !reservationData.end_date) {
      throw new Error('Les dates de début et de fin sont obligatoires');
    }
    
    if (!reservationData.full_name || !reservationData.email || !reservationData.phone) {
      throw new Error('Le nom complet, email et téléphone sont obligatoires');
    }

    // Insérer directement dans la table reservations
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert(reservationData)
      .select()
      .single();

    if (error) {
      console.error('❌ Insert error:', error);
      throw new Error(`Erreur d'insertion: ${error.message}`);
    }

    console.log('✅ Reservation created via direct insert:', reservation);

    // Envoyer l'email de confirmation
    let emailSent = false;
    try {
      console.log('📧 Sending confirmation email to:', data.email);
      
      const emailResult = await sendConfirmationEmail({
        to: data.email,
        subject: `Confirmation de réservation - ${data.fullName}`,
        reservationData: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          activity: data.activity,
          spaceType: data.spaceType,
          startDate: data.startDate,
          endDate: data.endDate,
          amount: data.amount,
          transactionId: data.transactionId,
          status: reservation.status || 'pending'
        }
      });
      
      emailSent = emailResult.emailSent;
      
      if (emailResult.simulation) {
        console.log('📧 Email simulated (service not configured)');
      } else if (emailSent) {
        console.log('✅ Confirmation email sent successfully');
      } else {
        console.warn('⚠️ Email sending failed:', emailResult.error);
      }
      
    } catch (emailError) {
      console.warn('⚠️ Email sending failed:', emailError);
      emailSent = false;
    }

    return {
      success: true,
      reservation,
      emailSent
    };

  } catch (error) {
    console.error('❌ Error in createReservationServiceRole:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
      emailSent: false
    };
  }
};