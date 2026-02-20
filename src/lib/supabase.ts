import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qzwudrcnhrcztinsaxmh.supabase.co'
const supabaseAnonKey = '***REMOVED_SUPABASE_ANON_KEY***'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
