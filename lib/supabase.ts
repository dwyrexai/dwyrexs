import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iobafnykjghgjfoysqnq.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYmFmbnlramdoZ2pmb3lzcW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzg5MDUsImV4cCI6MjA4OTk1NDkwNX0._Rd5SJfNBnuOgZCxh-8kehoYtZnlxQhHHwPuC_2-fIk'

export const supabase = createClient(supabaseUrl, supabaseKey)