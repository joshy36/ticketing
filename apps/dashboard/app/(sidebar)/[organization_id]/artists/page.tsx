import { isAuthed } from '../../../../utils/isAuthed';
import Artists from './Artists';
import { serverClient } from '../../../_trpc/serverClient';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  const artists = await serverClient.getArtistsByOrganization.query({
    organization_id: params.organization_id,
  });

  return (
    <div>
      <Artists artists={artists} />
    </div>
  );
}
