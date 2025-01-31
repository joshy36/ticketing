'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { trpc } from '~/app/_trpc/client';

export default function Venues({
  organization_id,
}: {
  organization_id: string;
}) {
  const { data: venues } = trpc.getVenuesByOrganization.useQuery({
    organization_id: organization_id,
  });

  return (
    <div className='pt-4'>
      <h1 className='pb-4 text-2xl font-semibold'>Venues</h1>
      {venues?.length === 0 && (
        <p className='pt-4 text-center font-light text-muted-foreground'>
          No venues found.
        </p>
      )}
      {venues?.map((venue) => (
        <a
          key={venue.id}
          className='flex flex-row items-center justify-between border-b px-4 py-2 hover:bg-zinc-800/40'
          href={`${process.env.NEXT_PUBLIC_TICKETS_BASE_URL}/venue/${venue.id}`}
          target='_blank'
          rel='noopener noreferrer'
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
        </a>
      ))}
    </div>
  );
}
