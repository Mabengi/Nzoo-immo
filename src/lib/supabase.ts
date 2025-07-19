import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zfxkyiusextbhhxemwuu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, using fallback values')
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
  display_order?: number
  admin_notes?: string
  availability_status?: 'available' | 'maintenance' | 'reserved' | 'unavailable'
  display_order?: number
  admin_notes?: string
  availability_status?: 'available' | 'maintenance' | 'reserved' | 'unavailable'
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'admin' | 'user'
  created_at: string
}