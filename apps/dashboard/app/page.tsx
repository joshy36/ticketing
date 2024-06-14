import { redirect } from 'next/navigation';
import createSupabaseServer from '~/utils/supabaseServer';
import { serverClient } from './_trpc/serverClient';

export default async function Home() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
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

      if (!userOrg) {
        redirect('/unauthorized');
      } else {
        redirect(`/${userOrg}`);
      }
    }
  }

  return <div>dashboard</div>;
}
