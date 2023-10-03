import { serverClient } from '@/app/_trpc/serverClient';
import Image from 'next/image';

export default async function EventView({
  params,
}: {
  params: { id: string };
}) {
  const artist = await serverClient.getArtistById({ id: params.id });

  if (!artist) {
    return (
      <div className="space-y-0.5 text-center mt-24">
        <h1 className="text-4xl font-bold tracking-tight">
          Artist does not exist!
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-8 pt-16 px-16">
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
          <p className="text-9xl py-4">{artist?.name}</p>
          <p className="text-2xl py-4">About</p>
          <p className="text-xl text-muted-foreground">{artist?.description}</p>
        </div>
      </div>
    </div>
  );
}
