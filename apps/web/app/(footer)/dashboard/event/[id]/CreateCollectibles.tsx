'use client';

import { trpc } from '~/app/_trpc/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Events } from 'supabase';
import { Skeleton } from '~/components/ui/skeleton';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { Icons } from '~/components/ui/icons';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';

export default function CreateCollectibles({ event }: { event: Events }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [didGenerateImages, setDidGenerateImages] = useState<boolean>(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const {
    data: collectibles,
    refetch: refetchCollectibles,
    isRefetching: isRefetchingCollectibles,
  } = trpc.getCollectiblesForEvent.useQuery({ event_id: event.id });

  const generateImages = trpc.generateEventImages.useMutation({
    onSettled(data, error, variables, context) {
      setIsLoading(false);
    },
  });

  const sortedCollectibles = collectibles
    ?.filter((collectible) => collectible.image != null)
    .sort((a, b) => {
      if (a.tickets?.token_id === null) return 1;
      if (b.tickets?.token_id === null) return -1;
      if (a.tickets?.token_id === b.tickets?.token_id) return 0;
      // @ts-ignore
      return a.tickets?.token_id < b.tickets?.token_id ? -1 : 1;
    });

  return (
    <Card className='mt-4 w-full rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Create Collectibles</CardTitle>
        <CardDescription>
          Input a prompt to generate images for your collectibles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-row gap-2'>
          <Input
            placeholder='An astronaut riding a horse on jupiter, hd, dramatic lighting'
            value={prompt}
            onChange={handlePromptChange}
          />
          <Button
            className='w-64 rounded-md'
            onClick={() => {
              setIsLoading(true);
              setDidGenerateImages(true);
              generateImages.mutate({ event_id: event.id, prompt: prompt });
            }}
            disabled={
              collectibles?.find((c) => c.image !== null) !== undefined ||
              isLoading ||
              didGenerateImages
            }
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            <ImageIcon className='pr-2' />
            Generate Images
          </Button>
        </div>
        <div className='flex flex-row items-center gap-8 pt-4'>
          <h2 className='py-4 text-lg font-bold'>Collectibles</h2>
          <Button
            onClick={() => refetchCollectibles()}
            className='rounded-md'
            variant='secondary'
            disabled={isRefetchingCollectibles}
          >
            {isRefetchingCollectibles && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            {/* <RefreshCcw className='pr-2' /> */}
            Refresh
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-y-8 pt-4 lg:grid-cols-4'>
          {sortedCollectibles?.map((collectible) => (
            <AlertDialog key={collectible.id}>
              <div className='flex justify-center'>
                <div className='relative'>
                  <Image
                    src={collectible.image!}
                    alt='image'
                    width={200}
                    height={200}
                    className='aspect-square rounded-tl-lg rounded-tr-lg'
                  />

                  <AlertDialogTrigger>
                    <Button className='absolute right-2 top-2 rounded-full bg-zinc-800/60 p-3 backdrop-blur-sm hover:bg-zinc-800/90'>
                      <RefreshCcw className='h-4 w-4 text-white' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Regenerate Image for Collectible #
                        {collectible.tickets?.token_id}
                      </AlertDialogTitle>
                      <AlertDialogDescription className='flex justify-center py-4'>
                        <Image
                          src={collectible.image!}
                          alt='image'
                          width={200}
                          height={200}
                          className='aspect-square rounded-lg'
                        />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Regenerate</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>

                  <div className='-mt-6 rounded-bl-lg rounded-br-lg bg-zinc-900'>
                    <h1 className='py-2 pl-4 text-sm'>
                      Id: #{collectible?.tickets?.token_id}
                    </h1>
                  </div>
                </div>
              </div>
            </AlertDialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
