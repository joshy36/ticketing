import { serverClient } from '@/app/_trpc/serverClient';
import EventsList from './EventsList';

export default async function Home() {
  const events = await serverClient.getEvents.query();
  return (
    <main>
      <EventsList events={events} />
    </main>
  );
}
