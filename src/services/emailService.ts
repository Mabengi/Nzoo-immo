import { supabase } from './supabaseClient';

export interface EmailData {
  to: string;
  subject: string;
  reservationData: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    activity: string;
    spaceType: string;
    startDate: string;
    endDate: string;
    amount: number;
    transactionId: string;
    status: string;
  };
}

export interface EmailResult {
  success: boolean;
  emailSent: boolean;
  error?: string;
  provider?: string;
  note?: string;
  details?: any;
}

export const sendConfirmationEmail = async (emailData: EmailData): Promise<EmailResult> => {
  try {
    console.log('📧 Preparing to send confirmation email to:', emailData.to);

    // Générer le contenu HTML de l'email avec design Nzoo Immo
    const emailHtml = generateNzooImmoEmailHtml(emailData.reservationData);

    console.log('📧 Calling Supabase edge function...');

    // Appeler la edge function pour envoyer l'email
    const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
      body: {
        to: emailData.to,
        subject: emailData.subject,
        html: emailHtml,
        reservationData: emailData.reservationData
      }
    });

    if (error) {
      console.error('❌ Error calling email function:', error);
      return {
        success: false,
        emailSent: false,
        error: `Erreur d'appel: ${error.message}`,
        details: error
      };
    }

    console.log('✅ Email function response:', data);

    // Si data est null mais pas d'erreur, considérer comme un succès partiel
    if (!data) {
      console.warn('⚠️ No data returned from email function');
      return {
        success: false,
        emailSent: false,
        error: 'Aucune réponse de la fonction email'
      };
    }

    return {
      success: data.success || false,
      emailSent: data.emailSent || false,
      provider: data.provider,
      error: data.error,
      details: data.details
    };

  } catch (error) {
    console.error('❌ Error in sendConfirmationEmail:', error);
    return {
      success: false,
      emailSent: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'envoi de l\'email',
      details: error
    };
  }
};

const generateNzooImmoEmailHtml = (reservationData: EmailData['reservationData']): string => {
  const formatSpaceType = (spaceType: string) => {
    const types: Record<string, string> = {
      'coworking': 'Espace Coworking',
      'bureau_prive': 'Bureau Privé',
      'bureau-prive': 'Bureau Privé',
      'domiciliation': 'Service de Domiciliation',
      'salle-reunion': 'Salle de Réunion'
    };
    return types[spaceType] || spaceType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatStatus = (status: string) => {
    const statuses: Record<string, string> = {
      'pending': 'En attente de confirmation',
      'confirmed': 'Confirmée',
      'cancelled': 'Annulée',
      'completed': 'Terminée'
    };
    return statuses[status] || status;
  };

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de Réservation - Nzoo Immo</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #183154;
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(24, 49, 84, 0.15);
        }
        
        .header {
          background: linear-gradient(135deg, #183154 0%, #1e3a5f 50%, #2a4a6b 100%);
          color: #FFFFFF;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-family: 'Montserrat', Arial, sans-serif;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 10px 0;
        }
        
        .header p {
          font-size: 16px;
          margin: 0;
          opacity: 0.9;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 25px;
          font-family: 'Montserrat', Arial, sans-serif;
        }
        
        .status-confirmed {
          background-color: #d4edda;
          color: #155724;
          border: 2px solid #c3e6cb;
        }
        
        .status-pending {
          background-color: #fff3cd;
          color: #856404;
          border: 2px solid #ffeaa7;
        }
        
        .details-card {
          background-color: #f8f9fa;
          border: 2px solid #D3D6DB;
          border-radius: 16px;
          padding: 30px;
          margin: 30px 0;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #D3D6DB;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-weight: 600;
          color: #183154;
          font-size: 15px;
          font-family: 'Montserrat', Arial, sans-serif;
        }
        
        .detail-value {
          color: #183154;
          font-weight: 500;
          text-align: right;
          font-family: 'Poppins', Arial, sans-serif;
        }
        
        .amount-highlight {
          background: linear-gradient(135deg, #183154 0%, #1e3a5f 100%);
          color: #FFFFFF;
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          margin: 30px 0;
        }
        
        .amount-highlight .amount {
          font-family: 'Montserrat', Arial, sans-serif;
          font-size: 36px;
          font-weight: 800;
          margin: 0;
        }
        
        .footer {
          background-color: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 2px solid #D3D6DB;
        }
        
        .footer p {
          margin: 8px 0;
          font-size: 14px;
          color: #6c757d;
          font-family: 'Poppins', Arial, sans-serif;
        }
        
        .contact-info {
          background-color: #e3f2fd;
          border: 2px solid #bbdefb;
          border-radius: 16px;
          padding: 25px;
          margin: 30px 0;
          text-align: center;
        }
        
        .contact-info h3 {
          font-family: 'Montserrat', Arial, sans-serif;
          color: #183154;
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 700;
        }
        
        .contact-info p {
          margin: 8px 0;
          color: #183154;
          font-family: 'Poppins', Arial, sans-serif;
          font-weight: 500;
        }
        
        .logo-section {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .logo-text {
          font-family: 'Montserrat', Arial, sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          background: #183154;
          padding: 15px 25px;
          border-radius: 12px;
          display: inline-block;
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 12px;
          }
          
          .header, .content, .footer {
            padding: 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .amount-highlight .amount {
            font-size: 28px;
          }
          
          .details-card {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo-section">
            <div class="logo-text">NZOO IMMO</div>
          </div>
          <h1>✅ Confirmation de Réservation</h1>
          <p>Espaces de Travail Modernes à Kinshasa</p>
        </div>
        
        <!-- Content -->
        <div class="content">
          <p style="font-size: 18px; margin-bottom: 20px;">Bonjour <strong style="color: #183154;">${reservationData.fullName}</strong>,</p>
          
          <p style="font-size: 16px; margin-bottom: 25px;">Nous avons le plaisir de confirmer votre réservation chez <strong>Nzoo Immo</strong>. Voici les détails de votre réservation :</p>
          
          <!-- Status Badge -->
          <div class="status-badge ${reservationData.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">
            📋 Statut : ${formatStatus(reservationData.status)}
          </div>
          
          <!-- Reservation Details -->
          <div class="details-card">
            <div class="detail-row">
              <span class="detail-label">🏢 Type d'espace :</span>
              <span class="detail-value">${formatSpaceType(reservationData.spaceType)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Date de début :</span>
              <span class="detail-value">${formatDate(reservationData.startDate)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Date de fin :</span>
              <span class="detail-value">${formatDate(reservationData.endDate)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📧 Email :</span>
              <span class="detail-value">${reservationData.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Téléphone :</span>
              <span class="detail-value">${reservationData.phone}</span>
            </div>
            ${reservationData.company ? `
            <div class="detail-row">
              <span class="detail-label">🏢 Entreprise :</span>
              <span class="detail-value">${reservationData.company}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="detail-label">💼 Activité :</span>
              <span class="detail-value">${reservationData.activity}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🔖 Référence :</span>
              <span class="detail-value"><strong>${reservationData.transactionId}</strong></span>
            </div>
          </div>
          
          <!-- Amount Highlight -->
          <div class="amount-highlight">
            <p style="margin: 0 0 15px 0; font-size: 18px; font-family: 'Poppins', Arial, sans-serif;">💰 Montant Total</p>
            <p class="amount">$${reservationData.amount}</p>
          </div>
          
          <!-- Contact Information -->
          <div class="contact-info">
            <h3>📞 Besoin d'aide ?</h3>
            <p><strong>📧 Email :</strong> nzooimmo16@gmail.com</p>
            <p><strong>📍 Adresse :</strong> Kinshasa, République Démocratique du Congo</p>
            <p><strong>🕒 Horaires :</strong> Lundi - Vendredi : 8h00 - 18h00</p>
          </div>
          
          <div style="background-color: #e8f4fd; border: 2px solid #b3d9ff; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0; color: #183154; font-weight: 600; text-align: center;">
              🎉 Merci de votre confiance ! Nous nous réjouissons de vous accueillir dans nos espaces modernes.
            </p>
          </div>
          
          <p style="margin-top: 30px; font-size: 16px;">
            Cordialement,<br>
            <strong style="color: #183154; font-family: 'Montserrat', Arial, sans-serif;">L'équipe Nzoo Immo</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p><strong style="font-family: 'Montserrat', Arial, sans-serif; color: #183154;">Nzoo Immo</strong></p>
          <p>Espaces de Travail Modernes à Kinshasa</p>
          <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">
            Cet email a été envoyé automatiquement. Pour toute question, contactez-nous à nzooimmo16@gmail.com
          </p>
          <p style="font-size: 11px; color: #999;">
            © 2025 Nzoo Immo. Tous droits réservés.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};