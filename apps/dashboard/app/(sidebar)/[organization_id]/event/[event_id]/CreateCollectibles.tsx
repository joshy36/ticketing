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

export default function CreateCollectibles({ event }: { event: Events }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const { data: collectibles, refetch: refetchCollectibles } =
    trpc.getCollectiblesForEvent.useQuery({ event_id: event.id });

  const { data: sbts, refetch: refetchSbts } = trpc.getSbtsForEvent.useQuery({
    event_id: event.id,
  });

  const generateImages = trpc.generateEventImages.useMutation({
    onSettled(data, error, variables, context) {
      setIsLoading(false);
    },
  });

  return (
    <Card className='mt-4 w-full rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Create Collectibles</CardTitle>
        <CardDescription>
          Input a prompt to generate images for your sbts and collectibles.
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
              generateImages.mutate({ event_id: event.id, prompt: prompt });
            }}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            <ImageIcon className='pr-2' />
            Generate Images
          </Button>
        </div>
        <h2 className='py-4 text-lg font-bold'>SBTs</h2>
        <Button
          // onClick={() => refetchSbts()}
          className='mb-4 rounded-md'
          variant='secondary'
        >
          <RefreshCcw className='pr-2' />
          Refresh
        </Button>
        <div className='grid grid-cols-4 gap-4'>
          {sbts?.map((sbt) => (
            <div key={sbt.id} className='flex justify-center'>
              <div>
                <Image
                  src={sbt.image || event.image!}
                  alt='image'
                  width={200}
                  height={200}
                  className='aspect-square rounded-tl-lg rounded-tr-lg'
                />
                <div className='rounded-bl-lg rounded-br-lg bg-zinc-900'>
                  <h1 className='py-2 pl-4 text-accent-foreground'>
                    {sbt?.tickets?.token_id}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h2 className='py-4 text-lg font-bold'>Collectibles</h2>
        <div className='grid grid-cols-4 gap-4 pt-4'>
          {collectibles?.map((collectible) => (
            <div key={collectible.id} className='flex justify-center'>
              <div>
                <Image
                  src={collectible.image || event.image!}
                  alt='image'
                  width={200}
                  height={200}
                  className='aspect-square rounded-tl-lg rounded-tr-lg'
                />
                <div className='rounded-bl-lg rounded-br-lg bg-zinc-900'>
                  <h1 className='py-2 pl-4 text-accent-foreground'>
                    {collectible?.tickets?.token_id}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
