import { serverClient } from '@/app/_trpc/serverClient';
import EventCheckout from '@/components/EventCheckout';
import createServerClient from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const userProfile = await serverClient.getUserProfile({
    id: session.user.id,
  });

  return (
    <main>
      <EventCheckout ticketId={params.id} userProfile={userProfile!} />
    </main>
  );
}
