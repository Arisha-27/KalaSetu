import { createClient } from '@supabase/supabase-js'

// 🔑 Replace with your own URL & Anon key from Supabase Dashboard → Project Settings → API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
