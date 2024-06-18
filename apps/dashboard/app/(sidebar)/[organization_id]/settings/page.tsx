import { isAuthed } from '../../../../utils/isAuthed';
import ManageOrg from './ManageOrg';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  return (
    <div>
      <ManageOrg organization_id={params.organization_id} />
    </div>
  );
}
