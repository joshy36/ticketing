import { isAuthed } from '../../../../utils/isAuthed';
import SendMessage from './SendMessage';

export default async function Home({ params }: { params: { id: string } }) {
  await isAuthed(params.id);

  return (
    <div>
      <SendMessage />
    </div>
  );
}
