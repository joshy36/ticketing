import { serverClient } from '@/app/_trpc/serverClient';

import createSupabaseServer from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import ConfirmPage from './ConfirmPage';

export default async function Home({
  params,
}: {
  params: { username: string; id: string };
}) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const userProfile = await serverClient.getUserProfile.query({
    username: params.username,
  });

  if (session?.user.id != userProfile?.id) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <ConfirmPage username={params.username} />
    </main>
  );
}
