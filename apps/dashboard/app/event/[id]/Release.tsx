'use clint';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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

  const {
    data: collectiblesReleasedData,
    isLoading: collectiblesReleasedDataLoading,
  } = trpc.collectiblesReleased.useQuery({
    event_id: event.id,
  });

  useEffect(() => {
    if (collectiblesReleasedData !== undefined) {
      setCollectiblesReleased(collectiblesReleasedData?.collectibles_released!);
    }
  }, [collectiblesReleasedData]);

  useEffect(() => {
    if (collectiblesReleasedData !== undefined) {
      setSbtsReleased(collectiblesReleasedData?.sbts_released!);
    }
  }, [collectiblesReleasedData]);

  const releaseCollectibles = trpc.releaseCollectiblesForEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Release collectibles error:', error);
        toast.error(`Error releasing collectibles: ${error.message}`);
        setIsLoadingCollectible(false);
      } else {
        toast.success('Collectibles released!');
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
        toast.error(`Error releasing sbts: ${error.message}`);
        setIsLoadingSbt(false);
      } else {
        toast.success('SBTs released!');
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
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => {
                setIsLoadingCollectible(true);
                releaseCollectibles.mutate({ event_id: event.id });
              }}
              disabled={
                isLoadingCollectible ||
                collectiblesReleased ||
                !collectiblesReleasedData?.collectible_etherscan_link
              }
              className='rounded-md'
            >
              {isLoadingCollectible && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              {collectiblesReleased && !collectiblesReleasedDataLoading ? (
                <p>Collectibles already released!</p>
              ) : (
                <p> Release Collectibles</p>
              )}
            </Button>
            {!collectiblesReleasedData?.collectible_etherscan_link &&
              !collectiblesReleasedDataLoading && (
                <p>Collectibles contract not deployed yet!</p>
              )}
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => {
                setIsLoadingSbt(true);
                releaseSbts.mutate({ event_id: event.id });
              }}
              disabled={
                isLoadingSbt ||
                sbtsReleased ||
                !collectiblesReleasedData?.sbt_etherscan_link
              }
              className='rounded-md'
            >
              {isLoadingSbt && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              {sbtsReleased && !collectiblesReleasedDataLoading ? (
                <p>SBTs already released!</p>
              ) : (
                <p> Release SBTs</p>
              )}
            </Button>
            {!collectiblesReleasedData?.sbt_etherscan_link &&
              !collectiblesReleasedDataLoading && (
                <p>SBTs contract not deployed yet!</p>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
