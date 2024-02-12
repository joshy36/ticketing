'use client';

import { dateToString } from '@/utils/helpers';
import { RouterOutputs } from 'api';
import Image from 'next/image';

export default function EventsList({
  events,
}: {
  events: RouterOutputs['getEvents'];
}) {
  return (
    <div className="bg-[url('/img5-70.png')] bg-cover bg-center">
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 '>
        <h1 className='pb-8 text-4xl font-light'>Explore Upcoming Events</h1>
        <div className='grid grid-cols-1 gap-y-2'>
          {events?.map((event: any) => (
            <a
              key={event.id}
              href={`/event/${event.id}`}
              className='group flex flex-row gap-6 rounded-3xl border bg-black/50 p-6 backdrop-blur-md hover:bg-black/60'
            >
              <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-24 overflow-hidden rounded-lg bg-background'>
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.description}
                    width={500}
                    height={500}
                    className='h-full w-full object-cover object-center transition group-hover:opacity-75'
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
              <div>
                <h1 className='text-xl font-medium text-accent-foreground'>
                  {event.name}
                </h1>
                <p className='mt-0.5 text-sm text-muted-foreground'>
                  {`${dateToString(event.date)}`}
                </p>
                <p className='mt-0.5 text-sm text-muted-foreground'>
                  {`${event.artists.name}`}
                </p>
                <p className='mt-0.5 text-sm text-muted-foreground'>
                  {`${event.venues.name}`}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
