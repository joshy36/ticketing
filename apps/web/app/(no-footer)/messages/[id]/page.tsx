import { serverClient } from '@/app/_trpc/serverClient';
import createSupabaseServer from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import StateManager from './StateManager';

export default async function Home({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthenticated');
  }

  const userProfile = await serverClient.getUserProfile.query({
    id: session.user.id,
  });

  return (
    <main>
      <StateManager userProfile={userProfile!} id={params.id} />
    </main>
  );
}
