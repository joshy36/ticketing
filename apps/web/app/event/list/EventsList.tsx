import { serverClient } from '../../_trpc/serverClient';
import { dateToString } from '@/utils/helpers';
import Image from 'next/image';

export default async function EventsList() {
  const data = await serverClient.getEvents.query();

  if (!data || data.length === 0) {
    return <div>Error: Failed to fetch events</div>;
  }

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <h1 className='pb-8 text-4xl font-light'>Explore Upcoming Events</h1>
      <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
        {data.map((event: any) => (
          <a key={event.id} href={`/event/${event.id}`} className='group'>
            <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background'>
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.description}
                  width={500}
                  height={500}
                  className='h-full w-full object-cover object-center transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-75'
                />
              ) : (
                <Image
                  src='/fallback.jpeg'
                  alt='image'
                  width={500}
                  height={500}
                  className='h-full w-full object-cover object-center group-hover:opacity-75'
                />
              )}
            </div>
            <h1 className='mt-2 text-xl text-accent-foreground'>
              {event.name}
            </h1>
            <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
              {`${dateToString(event.date)}`}
            </p>
            <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
              {`${event.venues.name}`}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
