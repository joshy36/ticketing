import { serverClient } from '../../../apps/web/app/_trpc/serverClient';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function ArtistView({
  params,
}: {
  params: { id: string };
}) {
  const artist = await serverClient.getArtistById({ id: params.id });

  if (!artist) {
    notFound();
  }

  return (
    <div>
      <div className='grid grid-cols-1 gap-8 px-4 pt-16 md:grid-cols-2 md:px-16'>
        <div className='flex items-center justify-center'>
          <Image
            src={artist.image!}
            alt={artist.description}
            width={500}
            height={500}
            className='rounded-lg'
          />
        </div>
        <div>
          <p className='py-4 text-8xl'>{artist.name}</p>
          <p className='py-4 text-2xl'>About</p>
          <p className='text-xl text-muted-foreground'>{artist.description}</p>
        </div>
      </div>
    </div>
  );
}
