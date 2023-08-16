'use client';
import NavBar from 'components/NavBar';
import EventCreate from '@/components/EventCreate';
import UploadImage from '@/components/UploadImage';

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className="container mx-auto px-100">
        <h1>Upload an Image for the Event</h1>
        <UploadImage />
        <EventCreate />
      </div>
    </main>
  );
}
