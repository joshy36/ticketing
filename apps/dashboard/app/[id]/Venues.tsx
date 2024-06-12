import { RouterOutputs } from 'api';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Venues({
  venues,
}: {
  venues: RouterOutputs['getVenuesByOrganization'] | undefined;
}) {
  return (
    <div className='pt-4'>
      {venues?.length === 0 && (
        <p className='pt-4 text-center font-light text-muted-foreground'>
          No venues found.
        </p>
      )}
      {venues?.map((venue) => (
        <Link
          key={venue.id}
          className='flex flex-row items-center justify-between border-b px-4 py-2 hover:bg-zinc-800/40'
          href={`/venue/${venue.id}`}
        >
          <div className='flex flex-row items-center gap-2'>
            <Image
              src={venue.image || '/apps/web/public/fallback.jpeg'}
              alt='venue image'
              width={48}
              height={48}
              className='aspect-square rounded-md'
            />
            <p>{venue.name}</p>
          </div>
          <ChevronRight />
        </Link>
      ))}
    </div>
  );
}
