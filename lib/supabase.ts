import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iobafnykjghgjfoysqnq.supabase.co'
const supabaseKey = 'sb_publishable_OTYxHeHrJsmKSTyrgapKkA_gjTp5gfZ'

export const supabase = createClient(supabaseUrl, supabaseKey)