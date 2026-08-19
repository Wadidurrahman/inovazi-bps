import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zrcrjoxdjwnuqeicwwgp.supabase.co'
const supabaseAnonKey = 'sb_publishable_OFLiKzxOXRHiEaDEtBpWTQ_Hl8h_YUL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)