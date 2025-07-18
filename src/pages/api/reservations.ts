import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialise ton client Supabase (met bien tes clés dans .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type ReservationRequestBody = {
  spaceType: string;
  dates: [string, string]; // ISO dates string format, ex: ['2025-07-20','2025-07-25']
  fullName: string;
  activity: string;
  company?: string;
  phone: string;
  email: string;
  address?: string;
  occupants: number;
  subscriptionType: 'daily' | 'monthly' | 'yearly' | 'hourly';
  paymentMethod: 'mobileMoney' | 'visa' | 'cash';
  transactionId?: string; // ID de transaction CinetPay ou 'CASH_timestamp'
  amountPaid: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const body: ReservationRequestBody = req.body;

  // Validation basique
  if (
    !body.spaceType ||
    !body.dates ||
    !body.fullName ||
    !body.phone ||
    !body.email ||
    !body.occupants ||
    !body.subscriptionType ||
    !body.paymentMethod ||
    !body.amountPaid
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Crée un enregistrement dans la table 'reservations'
    const { data, error } = await supabase.from('reservations').insert([
      {
        space_type: body.spaceType,
        start_date: body.dates[0],
        end_date: body.dates[1],
        full_name: body.fullName,
        activity: body.activity,
        company: body.company || null,
        phone: body.phone,
        email: body.email,
        address: body.address || null,
        occupants: body.occupants,
        subscription_type: body.subscriptionType,
        payment_method: body.paymentMethod,
        transaction_id: body.transactionId || null,
        amount_paid: body.amountPaid,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Erreur insertion réservation:', error);
      return res.status(500).json({ message: 'Database insertion error' });
    }

    return res.status(201).json({ message: 'Reservation saved', reservation: data });
  } catch (err) {
    console.error('Erreur API reservation:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
