import { serverClient } from '~/app/_trpc/serverClient';
import EventCreateTickets from './EventCreateTickets';
import createSupabaseServer from '~/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({
  params,
}: {
  params: { organizationId: string; id: string };
}) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // event creator must match id
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
      <div className='lg:px-80'>
        <EventCreateTickets
          eventId={params.id}
          organizationId={params.organizationId}
        />
      </div>
    </main>
  );
}
