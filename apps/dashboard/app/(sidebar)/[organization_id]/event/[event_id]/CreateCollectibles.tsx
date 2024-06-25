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
import { useEffect, useState } from 'react';
import { Icons } from '~/components/ui/icons';
import Image from 'next/image';
import createSupabaseBrowserClient from '~/utils/supabaseBrowser';

export default function CreateCollectibles({ event }: { event: Events }) {
  const supabase = createSupabaseBrowserClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const { data: collectibles, refetch: refetchCollectibles } =
    trpc.getCollectiblesForEvent.useQuery({
      event_id: event.id,
    });

  const sortedCollectibles = collectibles
    ?.filter((collectible) => collectible.image != null)
    .sort((a, b) => {
      const tokenA = a.tickets?.token_id;
      const tokenB = b.tickets?.token_id;
      if (tokenA && tokenB) {
        return tokenA - tokenB;
      }
      return 0;
    });

  const generateImages = trpc.generateEventImages.useMutation({
    onSettled(data, error, variables, context) {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('test-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collectibles',
          filter: `event_id=eq.${event?.id}`,
        },
        (payload) => {
          refetchCollectibles();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
            disabled={
              isLoading ||
              collectibles?.find((c) => c.image != null) != undefined
            }
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            <ImageIcon className='pr-2' />
            Generate Images
          </Button>
        </div>
        <div className='grid grid-cols-4 gap-4 pt-8'>
          {sortedCollectibles?.map((collectible) => (
            <div key={collectible.id} className='flex justify-center'>
              {collectible.image && (
                <div className='relative'>
                  <Image
                    src={collectible.image}
                    alt='image'
                    width={200}
                    height={200}
                    className='aspect-square rounded-lg border'
                  />
                  <div className='absolute bottom-0 left-0 right-0 rounded-bl-lg rounded-br-lg bg-zinc-900 bg-opacity-50 backdrop-blur-md'>
                    <h1 className='py-4 pl-4 text-sm font-light text-accent-foreground'>
                      {collectible?.tickets?.token_id}
                    </h1>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
