import { serverClient } from '../../../apps/web/app/_trpc/serverClient';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Separator } from './ui/separator';

export default async function VenueView({
  params,
}: {
  params: { id: string };
}) {
  const venue = await serverClient.getVenueById.query({ id: params.id });

  if (!venue) {
    notFound();
  }

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-col gap-8 md:flex-row'>
        <div className='items-center justify-center'>
          <Image
            src={venue.image!}
            alt={venue.description}
            width={250}
            height={250}
            className='rounded-lg'
          />
        </div>
        <div className='flex-1'>
          <p className='py-4 text-6xl font-light'>{venue.name}</p>
          <p className='py-4 text-2xl'>About</p>
          <p className='text-xl font-light text-muted-foreground'>
            {venue.description}
          </p>
        </div>
      </div>
      <Separator className='my-8' />
      <h1 className='pb-8 text-4xl font-light'>Upcoming Events</h1>
    </div>
  );
}
