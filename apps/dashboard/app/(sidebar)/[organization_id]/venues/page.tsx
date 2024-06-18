import { isAuthed } from '../../../../utils/isAuthed';
import Venues from './Venues';
import { serverClient } from '../../../_trpc/serverClient';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  const venues = await serverClient.getVenuesByOrganization.query({
    organization_id: params.organization_id,
  });

  return (
    <div>
      <Venues venues={venues} />
    </div>
  );
}
