import { serverClient } from '../../_trpc/serverClient';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default async function ArtistView({
  params,
}: {
  params: { id: string };
}) {
  const artist = await serverClient.getArtistById.query({ id: params.id });

  if (!artist) {
    notFound();
  }

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-col gap-8 md:flex-row'>
        <div className='items-center justify-center'>
          <Image
            src={artist.image!}
            alt={artist.description}
            width={250}
            height={250}
            className='rounded-lg'
          />
        </div>
        <div className='flex-1'>
          <p className='py-4 text-6xl font-light'>{artist.name}</p>
          <p className='py-4 text-2xl'>About</p>
          <p className='text-xl font-light text-muted-foreground'>
            {artist.description}
          </p>
        </div>
      </div>
      <Separator className='my-8' />
      <h1 className='pb-8 text-4xl font-light'>Upcoming Events</h1>
    </div>
  );
}
