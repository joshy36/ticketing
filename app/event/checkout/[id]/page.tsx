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

  return (
    <main>
      <EventCheckout ticketId={params.id} userId={session.user.id} />
    </main>
  );
}
