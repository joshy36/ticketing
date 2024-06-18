import { serverClient } from '~/app/_trpc/serverClient';
import ArtistCreate from './ArtistCreate';
import createSupabaseServer from '~/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { isAuthed } from '../../../../../utils/isAuthed';

export default async function Home({ params }: { params: { id: string } }) {
  await isAuthed(params.id);

  return (
    <main>
      <ArtistCreate organization={params.id} />
    </main>
  );
}
