// lib/waitlist-service.ts
import supabase, { WaitlistEntry } from './supabase';

/**
 * Submit a new waitlist entry to Supabase
 */
export async function submitWaitlistEntry(entry: WaitlistEntry): Promise<{ data: any | null; error: any | null }> {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          name: entry.name,
          email: entry.email,
          company: entry.company || null,
          interests: entry.interests || [],
        }
      ])
      .select();

    if (error) {
      console.error('Error submitting to waitlist:', error);

      // Check for duplicate email error
      if (error.code === '23505') {
        return {
          data: null,
          error: { message: 'This email is already on our waitlist.' }
        };
      }

      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error submitting to waitlist:', err);
    return {
      data: null,
      error: { message: 'An unexpected error occurred. Please try again later.' }
    };
  }
}

/**
 * Check if an email is already in the waitlist
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking email existence:', error);
      return false;
    }

    return data !== null;
  } catch (err) {
    console.error('Unexpected error checking email:', err);
    return false;
  }
}
