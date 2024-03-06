import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'supabase';

export const getTotalEventsAttended = async (
  supabase: SupabaseClient<Database>,
  user_id: string
): Promise<number> => {
  const { data: tickets } = await supabase
    .from('tickets')
    .select()
    .eq('user_id', user_id);

  const eventIds = tickets?.map((ticket) => ticket.event_id!);
  return [...new Set(eventIds)].length;
};

export const getEventsAttendedInOrg = async (
  supabase: SupabaseClient<Database>,
  user_id: string,
  organization_id: string
): Promise<any> => {
  const { data: tickets } = await supabase
    .from('tickets')
    .select(`*, events (organization_id)`)
    .eq('user_id', user_id);

  const ticketsInOrg = tickets?.filter(
    (ticket) => ticket.events?.organization_id === organization_id
  );
  const eventIds = ticketsInOrg?.map((ticket) => ticket.event_id!);
  return [...new Set(eventIds)].length;
};

export const areArraysEqual = (arr1: any[], arr2: any[]): boolean => {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort the arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Compare the sorted arrays element by element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
};
