'use client';
import NavBar from 'components/NavBar';
import EventCreate from '@/components/EventCreate';

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className="container mx-auto px-100">
        <EventCreate />
      </div>
    </main>
  );
}
