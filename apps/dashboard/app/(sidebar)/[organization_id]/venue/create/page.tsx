import VenueCreate from './VenueCreate';
import { isAuthed } from '~/utils/isAuthed';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  return (
    <main>
      <VenueCreate organization={params.organization_id} />
    </main>
  );
}
