import { isAuthed } from '../../../../utils/isAuthed';
import { serverClient } from '../../../_trpc/serverClient';
import ManageOrg from './ManageOrg';

export default async function Home({ params }: { params: { id: string } }) {
  await isAuthed(params.id);

  const organization = await serverClient.getOrganizationById.query({
    organization_id: params.id,
  });

  return (
    <div>
      <ManageOrg organization={organization} />
    </div>
  );
}
