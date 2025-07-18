import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Reservation {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  company?: string
  activity: string
  address?: string
  space_type: 'coworking' | 'bureau-prive' | 'salle-reunion'
  start_date: string
  end_date: string
  occupants: number
  subscription_type?: 'daily' | 'monthly' | 'yearly' | 'hourly'
  amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'failed'
  payment_method?: 'mobile_money' | 'visa'
}

export interface Space {
  id: string
  name: string
  type: 'coworking' | 'bureau-prive' | 'salle-reunion'
  description: string
  features: string[]
  max_occupants: number
  daily_price?: number
  monthly_price?: number
  yearly_price?: number
  hourly_price?: number
  is_active: boolean
  images: string[]
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'admin' | 'user'
  created_at: string
}