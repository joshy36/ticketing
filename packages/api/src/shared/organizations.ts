import { SupabaseClient } from '@supabase/supabase-js';
import { Database, UserProfile } from 'supabase';

export const getOrganizationMembers = async (
  supabase: SupabaseClient<Database>,
  organization_id: string
) => {
  const { data: members } = await supabase
    .from('organization_members')
    .select(`*, user_profiles (*)`)
    .eq('organization_id', organization_id);

  return members;
};
