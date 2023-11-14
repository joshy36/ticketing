import { serverClient } from '@/app/_trpc/serverClient';
import { TicketView } from '@/components/TicketView';
import createServerClient from '@/utils/supabaseServer';
import { notFound, redirect } from 'next/navigation';

export default async function Home({
  params,
}: {
  params: { ticket_id: string };
}) {
  let ticket;
  try {
    ticket = await serverClient.getTicketById.query({ id: params.ticket_id });
  } catch {
    notFound();
  }

  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session?.user.id != ticket?.user_id) {
    redirect('/unauthorized');
  }

  const userProfile = await serverClient.getUserProfile.query({
    id: session.user.id,
  });

  return (
    <main>
      <TicketView ticket={ticket} userProfile={userProfile!} />
    </main>
  );
}
