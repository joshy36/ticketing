/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    theme: {
      extend: {
        gridTemplateRows: {
          '[auto,auto,1fr]': 'auto auto 1fr',
        },
      },
    },
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/

import { serverClient } from '@/app/_trpc/serverClient';
import { Button } from '@/components/ui/button';
import createServerClient from '@/lib/supabaseServer';
import Image from 'next/image';
import Link from 'next/link';
import EventPurchase from './EventPurchase';

export default async function EventView({
  params,
}: {
  params: { id: string };
}) {
  const event = await serverClient.getEventById({ id: params.id });

  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = await serverClient.getUserProfile({ id: user?.id });

  return (
    <div className="bg-background">
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            {event?.image ? (
              <Image
                src={event?.image!}
                alt={event?.description!}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            ) : (
              <Image
                src="/fallback.jpeg"
                alt="image"
                width={500}
                height={500}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-rlg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl">
              {event?.name}
            </h1>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-rlg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-accent-foreground">
                  {event?.description}
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-base text-accent-foreground">{`Location: ${event?.location}`}</p>
              </div>
              <div className="space-y-6">
                <p className="text-base text-accent-foreground">{`Date: ${event?.date}`}</p>
              </div>
              <div className="space-y-6">
                <p className="text-base text-accent-foreground">{`Number of tickets remaining: ${event?.tickets_remaining}`}</p>
              </div>
              <EventPurchase
                user={user}
                userProfile={userProfile}
                event={event}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
