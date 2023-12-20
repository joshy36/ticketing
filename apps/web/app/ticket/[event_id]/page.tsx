import { serverClient } from '@/app/_trpc/serverClient';
import { TicketView } from './TicketView';
import createServerClient from '@/utils/supabaseServer';
import { notFound, redirect } from 'next/navigation';

export default async function Home({
  params,
}: {
  params: { event_id: string };
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthorized');
  }

  let tickets;
  try {
    tickets = await serverClient.getTicketsForUserByEvent.query({
      event_id: params.event_id,
    });
  } catch {
    notFound();
  }

  const userProfile = await serverClient.getUserProfile.query({
    id: session.user.id,
  });

  return (
    <main>
      <TicketView
        tickets={tickets}
        userProfile={userProfile!}
        event_id={params.event_id}
      />
    </main>
  );
}
