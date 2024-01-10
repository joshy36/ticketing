import { UserProfile } from 'supabase';

export const getOrganizationMembers = async (
  supabase: any,
  organization_id: string
) => {
  const { data: members } = await supabase
    .from('organization_members')
    .select()
    .eq('organization_id', organization_id);

  if (!members) return null;

  type Member = {
    created_at: string;
    id: string;
    organization_id: string | null;
    role: 'owner' | 'admin' | null;
    updated_at: string | null;
    user_id: string | null;
    profile: UserProfile;
  };

  let memberProfiles: Member[] = [];

  for (let i = 0; i < members?.length!; i++) {
    const { data: memberProfile } = await supabase
      .from('user_profiles')
      .select()
      .eq('id', members[i]!.user_id!)
      .limit(1)
      .single();

    memberProfiles.push({
      ...members[i]!,
      profile: memberProfile!,
    });
  }

  return memberProfiles;
};
