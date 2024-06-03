import { serverClient } from '../../../_trpc/serverClient';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Separator } from '~/components/ui/separator';

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
            width={150}
            height={150}
            className='aspect-square rounded-lg'
          />
        </div>
        <div className='flex-1'>
          <p className='py-4 text-4xl'>{venue.name}</p>
          <p className='font-light text-muted-foreground'>
            {venue.description}
          </p>
        </div>
      </div>
      <Separator className='my-8' />
      <h1 className='pb-8 text-2xl font-light'>Upcoming Events</h1>
    </div>
  );
}
