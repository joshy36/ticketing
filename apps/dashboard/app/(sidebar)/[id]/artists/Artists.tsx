import { RouterOutputs } from 'api';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Artists({
  artists,
}: {
  artists: RouterOutputs['getArtistsByOrganization'] | undefined;
}) {
  return (
    <div className='pt-4'>
      <h1 className='pb-4 text-2xl font-semibold'>Artists</h1>
      {artists?.length === 0 && (
        <p className='pt-4 text-center font-light text-muted-foreground'>
          No artists found.
        </p>
      )}
      {artists?.map((artist) => (
        <a
          key={artist.id}
          className='flex flex-row items-center justify-between border-b px-4 py-2 hover:bg-zinc-800/40'
          href={`${process.env.NEXT_PUBLIC_TICKETS_BASE_URL}/artist/${artist.id}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='flex flex-row items-center gap-2'>
            <Image
              src={artist.image || '/apps/web/public/fallback.jpeg'}
              alt='artist image'
              width={48}
              height={48}
              className='aspect-square rounded-md'
            />
            <p>{artist.name}</p>
          </div>
          <ChevronRight />
        </a>
      ))}
    </div>
  );
}
