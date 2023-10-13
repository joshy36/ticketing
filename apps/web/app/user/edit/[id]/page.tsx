import ProfilePage from '@/components/ProfilePage';
import createServerClient from '../../../../utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user.id != params.id) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <ProfilePage params={{ id: params.id }} />
    </main>
  );
}
