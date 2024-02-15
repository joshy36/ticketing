import VenueView from './VenueView';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <VenueView params={{ id: params.id }} />
    </main>
  );
}
