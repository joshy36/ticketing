import EventCreate from './EventCreate';
import { isAuthed } from '~/utils/isAuthed';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  return (
    <main>
      <EventCreate organizationId={params.organization_id} />
    </main>
  );
}
