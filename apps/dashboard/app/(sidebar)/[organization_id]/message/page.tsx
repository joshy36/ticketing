import { isAuthed } from '../../../../utils/isAuthed';
import SendMessage from './SendMessage';

export default async function Home({
  params,
}: {
  params: { organization_id: string };
}) {
  await isAuthed(params.organization_id);

  return (
    <div>
      <SendMessage />
    </div>
  );
}
