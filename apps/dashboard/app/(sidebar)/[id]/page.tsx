import Dashboard from './Dashboard';
import { serverClient } from '../../_trpc/serverClient';
import { notFound } from 'next/navigation';
import createSupabaseServer from '~/utils/supabaseServer';
import { redirect } from 'next/navigation';

const sidebarNavItems = [
  {
    title: 'Events',
    href: '/',
  },
];

export default async function Home({ params }: { params: { id: string } }) {
  const organization = await serverClient.getOrganizationById.query({
    organization_id: params.id,
  });

  if (!organization) {
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

  return (
    <main>
      <Dashboard id={params.id} />
    </main>
  );
}
