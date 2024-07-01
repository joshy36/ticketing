'use client';

import { dateToString } from '~/utils/helpers';
import { RouterOutputs } from 'api';
import Image from 'next/image';
import { Card, CardContent } from '~/components/ui/card';
import Link from 'next/link';

export default function EventsList({
  events,
}: {
  events: RouterOutputs['getEvents'];
}) {
  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 '>
      <h1 className='pb-8 pt-12 text-4xl'>Explore Upcoming Events</h1>

      <section className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {events?.map((event) => (
          <Link href={`/event/${event.id}`} key={event.id}>
            <div>
              <Card className='group overflow-hidden border shadow-2xl shadow-black hover:shadow-none'>
                <Image
                  src={event.image!}
                  alt='Event Image'
                  width={400}
                  height={300}
                  className='aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105'
                />
                <CardContent className='bg-zinc-950 p-4'>
                  <h3 className='text-lg font-semibold'>{event.name}</h3>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <span className='flex-shrink-0'>{`${dateToString(event.date)}`}</span>
                    <span className='mx-2 flex-shrink-0'>·</span>
                    <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                      {`${event.artists?.name}`}
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {`${event.venues?.name}`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
