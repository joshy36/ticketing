'use client';
import { useParams } from 'next/navigation';
import EventView from '../../../components/EventView';

export default function Home() {
  const params = useParams();
  const id = params.id[0];

  return (
    <main>
      <EventView params={{ id: id }} />
    </main>
  );
}
