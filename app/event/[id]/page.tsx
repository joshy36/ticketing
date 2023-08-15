import NavBar from 'components/NavBar';
import EventView from '@/components/EventView';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <NavBar />
      <EventView params={{ id: params.id }} />
    </main>
  );
}
