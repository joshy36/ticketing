import { isAuthed } from '../../../../utils/isAuthed';
import Venues from './Venues';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  return (
    <div>
      <Venues organization_id={params.organization_id} />
    </div>
  );
}
