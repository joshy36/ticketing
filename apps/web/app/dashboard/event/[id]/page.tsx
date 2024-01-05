import { serverClient } from '../../../_trpc/serverClient';
import { notFound } from 'next/navigation';
import createSupabaseServer from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import ManageEvent from './ManageEvent';

export default async function Home({ params }: { params: { id: string } }) {
  const event = await serverClient.getEventById.query({ id: params.id });

  if (!event) {
    notFound();
  }

  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const isInOrganization = await serverClient.getUserOrganization.query({
    user_id: session?.user.id,
  });

  if (!isInOrganization) {
    redirect('/unauthorized');
  }

  // check if user org is the same as the org of the user who created the event
  const eventCreator = await serverClient.getUserProfile.query({
    id: event?.created_by,
  });

  if (eventCreator?.organization_id !== isInOrganization) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <ManageEvent id={params.id} />
    </main>
  );
}
