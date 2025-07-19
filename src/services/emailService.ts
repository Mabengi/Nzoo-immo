import emailjs from '@emailjs/browser';

interface EmailData {
  to_email: string;
  to_name: string;
  reservation_id: string;
  space_type: string;
  start_date: string;
  end_date: string;
  amount: number;
  payment_method: string;
  company?: string;
  activity: string;
  occupants: number;
}

export const sendReservationConfirmationEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS configuration missing');
      return false;
    }

    const templateParams = {
      to_email: data.to_email,
      to_name: data.to_name,
      reservation_id: data.reservation_id,
      space_type: data.space_type,
      start_date: new Date(data.start_date).toLocaleDateString('fr-FR'),
      end_date: new Date(data.end_date).toLocaleDateString('fr-FR'),
      amount: data.amount,
      payment_method: data.payment_method === 'cash' ? 'Paiement en espèces' : data.payment_method,
      company: data.company || 'Non spécifiée',
      activity: data.activity,
      occupants: data.occupants,
      message: `Votre réservation a été confirmée avec succès. Référence: ${data.reservation_id}`
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Email de confirmation envoyé avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};