import { serverClient } from '@/app/_trpc/serverClient';
import TicketList from '@/components/TicketList';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const userProfile = await serverClient.getUserProfile.query({
    id: session.user.id,
  });

  return (
    <main>
      <TicketList userProfile={userProfile!} />
    </main>
  );
}
