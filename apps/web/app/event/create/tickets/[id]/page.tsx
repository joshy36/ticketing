import EventCreateTickets from './EventCreateTickets';
import createSupabaseServer from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // event creator must match id
  if (!session?.user) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <div className='lg:px-80'>
        <EventCreateTickets eventId={params.id} />
      </div>
    </main>
  );
}
