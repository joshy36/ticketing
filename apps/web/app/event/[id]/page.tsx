import EventView from './EventView';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <EventView params={{ id: params.id }} />
    </main>
  );
}
