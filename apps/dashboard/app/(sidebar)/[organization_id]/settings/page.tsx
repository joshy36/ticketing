import { isAuthed } from '../../../../utils/isAuthed';
import { serverClient } from '../../../_trpc/serverClient';
import ManageOrg from './ManageOrg';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  const organization = await serverClient.getOrganizationById.query({
    organization_id: params.organization_id,
  });

  return (
    <div>
      <ManageOrg organization={organization} />
    </div>
  );
}
