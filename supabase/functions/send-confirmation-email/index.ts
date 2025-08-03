const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  reservationData?: any
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { to, subject, html, reservationData }: EmailRequest = await req.json()

    console.log('📧 Sending email to:', to)
    console.log('📧 Subject:', subject)
    console.log('📧 Reservation data:', reservationData)

    // Récupérer les variables d'environnement
    const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY')
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'nzooimmo16@gmail.com'
    
    if (!sendGridApiKey) {
      console.error('❌ SENDGRID_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuration email manquante. Veuillez configurer SENDGRID_API_KEY.',
          emailSent: false
        }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      )
    }

    console.log('📧 Using SendGrid with API key:', sendGridApiKey.substring(0, 10) + '...')

    // Utiliser l'API SendGrid pour envoyer l'email
    const emailData = {
      personalizations: [{
        to: [{ email: to }],
        subject: subject
      }],
      from: { 
        email: fromEmail, 
        name: 'Nzoo Immo - Réservations' 
      },
      content: [{
        type: 'text/html',
        value: html
      }],
      reply_to: {
        email: fromEmail,
        name: 'Support Nzoo Immo'
      }
    }

    console.log('📧 Preparing to send via SendGrid...')
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    console.log('📧 SendGrid response status:', response.status)
    
    if (response.ok) {
      console.log('✅ Email sent successfully via SendGrid')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully via SendGrid',
          emailSent: true,
          provider: 'sendgrid'
        }),
        {
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      )
    } else {
      const errorText = await response.text()
      console.error('❌ SendGrid error:', response.status, errorText)
      
      // Essayer un service alternatif ou retourner une erreur informative
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erreur SendGrid: ${response.status} - ${errorText}`,
          emailSent: false,
          details: {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          }
        }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      )
    }

  } catch (error) {
    console.error('❌ Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Erreur serveur: ${error.message}`,
        emailSent: false,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})