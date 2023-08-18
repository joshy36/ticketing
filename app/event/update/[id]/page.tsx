'use client';
import EventUpdate from '@/components/EventUpdate';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <div className="container mx-auto px-100">
        <EventUpdate params={{ id: params.id }} />
      </div>
    </main>
  );
}
