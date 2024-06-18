import Dashboard from './Dashboard';
import { serverClient } from '../../_trpc/serverClient';
import { notFound } from 'next/navigation';
import { isAuthed } from '~/utils/isAuthed';

const sidebarNavItems = [
  {
    title: 'Events',
    href: '/',
  },
];

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  const organization = await serverClient.getOrganizationById.query({
    organization_id: params.organization_id,
  });

  if (!organization) {
    notFound();
  }

  await isAuthed(params.organization_id);

  return (
    <main>
      <Dashboard id={params.organization_id} />
    </main>
  );
}
