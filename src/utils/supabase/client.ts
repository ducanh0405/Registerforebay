import { createClient } from '@jsr/supabase__supabase-js@2.49.8';

// Fallback values from info.tsx if env vars are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wzgqvnuodmupsrlqjtyh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z3F2bnVvZG11cHNybHFqdHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Nzk3NTMsImV4cCI6MjA3ODQ1NTc1M30.OFYSP11oYjVOt2NfYYtFLxwWkju1F_bDeXR1x4Q6EeQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

