'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ManageEvent({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const releaseCollectibles = trpc.releaseCollectiblesForEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Release collectibles error:', error);
        setIsLoading(false);
      } else {
        console.log('collectibles released!');
        setIsLoading(false);
      }
    },
  });

  const releaseSbts = trpc.releaseSbtsForEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Release sbts error:', error);
        setIsLoading(false);
      } else {
        console.log('sbts released!');
        setIsLoading(false);
      }
    },
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-row justify-between'>
        <div>
          <h1 className='pb-8 text-4xl font-light'>Manage Event</h1>
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='rounded-md' variant='link' asChild>
            <Link href={`/event/${id}`}>
              <div className='flex flex-row items-center gap-2 text-xl font-light text-muted-foreground hover:text-white'>
                View Event Page <ExternalLink className='h-4 w-4' />
              </div>
            </Link>
          </Button>
        </div>
      </div>

      <div className='flex flex-row items-center gap-2'>
        <Button
          onClick={() => {
            setIsLoading(true);
            releaseCollectibles.mutate({ event_id: id });
          }}
          disabled={true}
          className='rounded-md'
        >
          Release Collectibles
        </Button>
        <Button
          onClick={() => {
            setIsLoading(true);
            releaseSbts.mutate({ event_id: id });
          }}
          disabled={true}
          className='rounded-md'
        >
          Release SBTs
        </Button>
      </div>
    </div>
  );
}
