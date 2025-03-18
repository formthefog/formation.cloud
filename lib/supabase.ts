// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Type for the waitlist database
export type WaitlistEntry = {
  id?: string;
  name: string;
  email: string;
  company?: string | null;
  interests?: string[];
  created_at?: string;
};

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
