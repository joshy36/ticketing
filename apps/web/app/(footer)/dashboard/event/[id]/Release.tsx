'use clint';

import { use, useEffect, useState } from 'react';
import { Events } from 'supabase';
import { trpc } from '~/app/_trpc/client';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Icons } from '~/components/ui/icons';

export default function Release({ event }: { event: Events }) {
  const [isLoadingSbt, setIsLoadingSbt] = useState<boolean>(false);
  const [isLoadingCollectible, setIsLoadingCollectible] =
    useState<boolean>(false);
  const [collectiblesReleased, setCollectiblesReleased] =
    useState<boolean>(true);
  const [sbtsReleased, setSbtsReleased] = useState<boolean>(true);

  const { data: collectiblesReleasedData } = trpc.collectiblesReleased.useQuery(
    {
      event_id: event.id,
    },
  );

  const { data: sbtsReleasedData } = trpc.sbtsReleased.useQuery({
    event_id: event.id,
  });

  useEffect(() => {
    if (collectiblesReleasedData !== undefined) {
      setCollectiblesReleased(collectiblesReleasedData);
    }
  }, [collectiblesReleasedData]);

  useEffect(() => {
    if (sbtsReleasedData !== undefined) {
      setSbtsReleased(sbtsReleasedData);
    }
  }, [sbtsReleasedData]);

  const releaseCollectibles = trpc.releaseCollectiblesForEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Release collectibles error:', error);
        setIsLoadingCollectible(false);
      } else {
        console.log('collectibles released!');
        setIsLoadingCollectible(false);
        setCollectiblesReleased(true);
      }
    },
  });

  const releaseSbts = trpc.releaseSbtsForEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Release sbts error:', error);
        setIsLoadingSbt(false);
      } else {
        console.log('sbts released!');
        setIsLoadingSbt(false);
        setSbtsReleased(true);
      }
    },
  });

  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Release Post Event Collectibles</CardTitle>
        {/* <CardDescription>After the event</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className='flex flex-row items-center gap-2'>
          <Button
            onClick={() => {
              setIsLoadingCollectible(true);
              releaseCollectibles.mutate({ event_id: event.id });
            }}
            disabled={isLoadingCollectible || collectiblesReleased}
            className='rounded-md'
          >
            {isLoadingCollectible && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Release Collectibles
          </Button>
          <Button
            onClick={() => {
              setIsLoadingSbt(true);
              releaseSbts.mutate({ event_id: event.id });
            }}
            disabled={isLoadingSbt || sbtsReleased}
            className='rounded-md'
          >
            {isLoadingSbt && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Release SBTs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
