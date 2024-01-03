import { serverClient } from '@/app/_trpc/serverClient';
import EventCreate from './EventCreate';
import createSupabaseServer from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/unauthorized');
  }

  const isInOrganization = await serverClient.getUserOrganization.query({
    user_id: session?.user.id,
  });

  if (!isInOrganization) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <EventCreate />
    </main>
  );
}
