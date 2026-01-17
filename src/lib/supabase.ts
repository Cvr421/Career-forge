import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions matching our database schema
export type Section = {
  id: string
  type: 'hero' | 'about' | 'culture' | 'values' | 'perks' | 'custom'
  visible: boolean
  order: number
  data: {
    title?: string
    subtitle?: string
    content?: string
    items?: string[]
    [key: string]: any
  }
}

export type Company = {
  id: string
  owner_id: string
  name: string
  slug: string
  brand_primary_color: string
  brand_accent_color: string
  logo_url: string | null
  banner_url: string | null
  culture_video_url: string | null
  sections: Section[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Job = {
  id: string
  company_id: string
  title: string
  work_policy: string | null
  location: string | null
  department: string | null
  employment_type: string | null
  experience_level: string | null
  job_type: string | null
  salary_range: string | null
  job_slug: string
  description: string
  is_open: boolean
  posted_days_ago: number
  created_at: string
}
