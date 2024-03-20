import { serverClient } from '@/app/_trpc/serverClient';
import { TicketView } from './TicketView';
import createSupabaseServer from '@/utils/supabaseServer';
import { notFound, redirect } from 'next/navigation';
import { RouterOutputs } from '@/app/_trpc/client';

export default async function Home({
  params,
}: {
  params: { event_id: string };
}) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthorized');
  }

  let tickets: RouterOutputs['getTicketsForUserByEvent'];
  try {
    tickets = await serverClient.getTicketsForUserByEvent.query({
      event_id: params.event_id,
      user_id: session.user.id,
    });
  } catch (e) {
    console.log('error', e);
    notFound();
  }

  if (!tickets) {
    notFound();
  }

  const userProfile = await serverClient.getUserProfile.query({
    id: session.user.id,
  });

  const usersWithoutTickets =
    await serverClient.getUsersWithoutTicketsForEvent.query({
      event_id: params.event_id,
    });

  return (
    <main>
      <TicketView
        tickets={tickets}
        userProfile={userProfile!}
        event_id={params.event_id}
        usersWithoutTickets={usersWithoutTickets}
      />
    </main>
  );
}
