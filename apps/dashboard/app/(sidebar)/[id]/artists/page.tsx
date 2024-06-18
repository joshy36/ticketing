import { isAuthed } from '../../../../utils/isAuthed';
import Artists from './Artists';
import { serverClient } from '../../../_trpc/serverClient';

export default async function Home({ params }: { params: { id: string } }) {
  await isAuthed(params.id);

  const artists = await serverClient.getArtistsByOrganization.query({
    organization_id: params.id,
  });

  return (
    <div>
      <Artists artists={artists} />
    </div>
  );
}
