import { supabase } from '../utils/supabase/client';
import { ShiftType, ShiftRegistration } from '../App';

export interface ShiftRegistrationRow {
  id: string;
  date: string;
  shift: ShiftType;
  user_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row to app format
 */
function rowToRegistration(row: ShiftRegistrationRow): ShiftRegistration {
  return {
    date: row.date,
    shift: row.shift,
    users: [row.user_name]
  };
}

/**
 * Group rows by date and shift
 */
function groupRegistrations(rows: ShiftRegistrationRow[]): ShiftRegistration[] {
  const grouped = new Map<string, ShiftRegistration>();
  
  rows.forEach(row => {
    const key = `${row.date}-${row.shift}`;
    if (grouped.has(key)) {
      const existing = grouped.get(key)!;
      if (!existing.users.includes(row.user_name)) {
        existing.users.push(row.user_name);
      }
    } else {
      grouped.set(key, rowToRegistration(row));
    }
  });
  
  return Array.from(grouped.values());
}

/**
 * Get all shift registrations
 */
export async function getShiftRegistrations(): Promise<ShiftRegistration[]> {
  const { data, error } = await supabase
    .from('shift_registrations')
    .select('*')
    .order('date', { ascending: true })
    .order('shift', { ascending: true })
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching shift registrations:', error);
    throw error;
  }
  
  return groupRegistrations(data || []);
}

/**
 * Register a user for a shift
 */
export async function registerShift(
  date: string,
  shift: ShiftType,
  userName: string
): Promise<void> {
  // Check if shift is full (max 2 users)
  const { data: existing, error: checkError } = await supabase
    .from('shift_registrations')
    .select('*')
    .eq('date', date)
    .eq('shift', shift);
  
  if (checkError) {
    console.error('Error checking shift capacity:', checkError);
    throw checkError;
  }
  
  if (existing && existing.length >= 2) {
    throw new Error('Shift is full (maximum 2 users)');
  }
  
  // Check if user is already registered
  const isRegistered = existing?.some(r => r.user_name === userName);
  if (isRegistered) {
    throw new Error('User is already registered for this shift');
  }
  
  // Insert registration
  const { error } = await supabase
    .from('shift_registrations')
    .insert({
      date,
      shift,
      user_name: userName
    });
  
  if (error) {
    console.error('Error registering shift:', error);
    // Handle unique constraint violation
    if (error.code === '23505') {
      throw new Error('User is already registered for this shift');
    }
    throw error;
  }
}

/**
 * Unregister a user from a shift
 */
export async function unregisterShift(
  date: string,
  shift: ShiftType,
  userName: string
): Promise<void> {
  const { error } = await supabase
    .from('shift_registrations')
    .delete()
    .eq('date', date)
    .eq('shift', shift)
    .eq('user_name', userName);
  
  if (error) {
    console.error('Error unregistering shift:', error);
    throw error;
  }
}

/**
 * Toggle registration (register if not registered, unregister if registered)
 */
export async function toggleShiftRegistration(
  date: string,
  shift: ShiftType,
  userName: string
): Promise<void> {
  // Check if user is already registered
  const { data: existing, error: checkError } = await supabase
    .from('shift_registrations')
    .select('*')
    .eq('date', date)
    .eq('shift', shift)
    .eq('user_name', userName)
    .maybeSingle();
  
  if (checkError) {
    console.error('Error checking registration:', checkError);
    throw checkError;
  }
  
  if (existing) {
    // Unregister
    await unregisterShift(date, shift, userName);
  } else {
    // Register
    await registerShift(date, shift, userName);
  }
}

/**
 * Subscribe to shift registrations changes (real-time)
 */
export function subscribeToShiftRegistrations(
  callback: (registrations: ShiftRegistration[]) => void
) {
  const channel = supabase
    .channel('shift_registrations_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shift_registrations'
      },
      async () => {
        // Refetch all registrations when any change occurs
        const registrations = await getShiftRegistrations();
        callback(registrations);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

