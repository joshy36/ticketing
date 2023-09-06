import EventCreateImage from '@/components/EventCreateImage';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <div className="lg:px-80">
        <EventCreateImage id={params.id} />
      </div>
    </main>
  );
}
