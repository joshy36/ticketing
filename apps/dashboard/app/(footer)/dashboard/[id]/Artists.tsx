import { RouterOutputs } from 'api';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Artists({
  artists,
}: {
  artists: RouterOutputs['getArtistsByOrganization'] | undefined;
}) {
  return (
    <div className='pt-4'>
      {artists?.length === 0 && (
        <p className='pt-4 text-center font-light text-muted-foreground'>
          No artists found.
        </p>
      )}
      {artists?.map((artist) => (
        <Link
          key={artist.id}
          className='flex flex-row items-center justify-between border-b px-4 py-2 hover:bg-zinc-800/40'
          href={`/artist/${artist.id}`}
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
        </Link>
      ))}
    </div>
  );
}
