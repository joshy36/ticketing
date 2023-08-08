import EventView from '@/components/EventView';
import NavBar from 'components/NavBar';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <NavBar />
      <EventView params={{ id: params.id }} />
    </main>
  );
}
