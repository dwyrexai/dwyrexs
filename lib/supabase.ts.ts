import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ENV VARLIKLARI EKSİK! Lütfen .env.local dosyasını kontrol et.');
  throw new Error('Supabase URL veya ANON_KEY boş. Lütfen .env.local dosyasını kontrol et.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);