import { serverClient } from '../app/_trpc/serverClient';
import createSupabaseServer from './supabaseServer';
import { redirect } from 'next/navigation';

export const isAuthed = async (organizationId: string) => {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/unauthenticated');
  } else {
    const userProfile = await serverClient.getUserProfile.query({
      id: user?.id,
    });

    if (!userProfile) {
      redirect('/unauthenticated');
    } else {
      const userOrg = await serverClient.getUserOrganization.query({
        user_id: userProfile?.id,
      });

      if (!userOrg || userOrg !== organizationId) {
        redirect('/unauthorized');
      }
    }
  }
};
