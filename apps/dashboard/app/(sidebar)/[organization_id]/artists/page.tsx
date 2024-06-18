import { isAuthed } from '../../../../utils/isAuthed';
import Artists from './Artists';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  return (
    <div>
      <Artists organization_id={params.organization_id} />
    </div>
  );
}
