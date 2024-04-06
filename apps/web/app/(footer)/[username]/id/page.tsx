import { serverClient } from '@/app/_trpc/serverClient';
import createSupabaseServer from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { Id } from './Id';

export default async function Home({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createSupabaseServer();

  const userProfile = await serverClient.getUserProfile.query({
    username: params.username,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user.id != userProfile?.id) {
    redirect('/unauthorized');
  }

  const userSalt = await serverClient.getUserSalt.query({
    user_id: userProfile?.id!,
  });

  const tickets = await serverClient.getTicketsForUser.query({
    user_id: userProfile?.id!,
  });

  return (
    <main>
      <Id
        userProfile={userProfile!}
        userSalt={userSalt?.salt}
        tickets={tickets}
      />
    </main>
  );
}
