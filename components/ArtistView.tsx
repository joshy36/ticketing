import { serverClient } from '@/app/_trpc/serverClient';
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
      <div className="px-4 md:px-16 grid grid-cols-1 gap-8 pt-16 md:grid-cols-2">
        <div className="flex justify-center items-center">
          <Image
            src={artist.image!}
            alt={artist.description}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div>
          <p className="text-8xl py-4">{artist.name}</p>
          <p className="text-2xl py-4">About</p>
          <p className="text-xl text-muted-foreground">{artist.description}</p>
        </div>
      </div>
    </div>
  );
}
