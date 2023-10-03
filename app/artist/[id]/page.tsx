import ArtistView from '@/components/ArtistView';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <ArtistView params={{ id: params.id }} />
    </main>
  );
}
