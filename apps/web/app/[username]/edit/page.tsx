import { serverClient } from '@/app/_trpc/serverClient';
import ProfilePage from '@/components/ProfilePage';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createServerClient();

  const userProfile = await serverClient.getUserProfile.query({
    username: params.username,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user.id != userProfile?.id) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <ProfilePage params={{ username: params.username }} />
    </main>
  );
}
