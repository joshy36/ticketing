import EventCreate from './EventCreate';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <div className='lg:px-80'>
        <EventCreate />
      </div>
    </main>
  );
}
