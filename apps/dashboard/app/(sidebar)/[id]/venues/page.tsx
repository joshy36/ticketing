import { isAuthed } from '../../../../utils/isAuthed';
import Venues from './Venues';
import { serverClient } from '../../../_trpc/serverClient';

export default async function Home({ params }: { params: { id: string } }) {
  await isAuthed(params.id);

  const venues = await serverClient.getVenuesByOrganization.query({
    organization_id: params.id,
  });

  return (
    <div>
      <Venues venues={venues} />
    </div>
  );
}
