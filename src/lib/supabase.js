import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
// Debug: Check if environment variables are loaded

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

