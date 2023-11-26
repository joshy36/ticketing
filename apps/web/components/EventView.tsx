import { serverClient } from '../../web/app/_trpc/serverClient';
import createServerClient from '@/utils/supabaseServer';
import Image from 'next/image';
import EventPurchase from './EventPurchase';
import { Button } from './ui/button';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { dateToString } from '../utils/helpers';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader } from './ui/card';
import { Suspense } from 'react';

export default async function EventView({
  params,
}: {
  params: { id: string };
}) {
  const event = await serverClient.getEventById.query({ id: params.id });

  if (!event) {
    notFound();
  }

  const artist = await serverClient.getArtistById.query({ id: event.artist });
  const venue = await serverClient.getVenueById.query({ id: event.venue });
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userProfile = null;

  if (session?.user) {
    userProfile = await serverClient.getUserProfile.query({
      id: session.user?.id,
    });
  }

  return (
    <div className='flex justify-center bg-background px-4'>
      <div className='pt-9 md:px-16'>
        <div className='lg:border-rlg:pr-8 text-center lg:col-span-2'>
          <h1 className='text-8xl font-medium'>{event.name}</h1>
        </div>
        <div className='space-y-6 text-center'>
          <p className='py-3 text-xl text-muted-foreground'>
            {dateToString(event.date)}
          </p>
        </div>
        <div className='grid grid-cols-1 justify-center gap-8 pt-6 md:max-w-[1200px] md:grid-cols-2 '>
          <div>
            <Card className='w-full border bg-zinc-950 p-2 shadow-2xl shadow-zinc-800 '>
              <CardHeader className='text-3xl font-bold'>
                Buy Tickets
              </CardHeader>
              <CardContent>
                <EventPurchase userProfile={userProfile} event={event} />
              </CardContent>
            </Card>
          </div>
          <div>
            {event.image ? (
              // <div className='relative'>
              <Image
                src={event.image!}
                alt={event.description}
                width={500}
                height={500}
                className='rounded-lg'
              />
            ) : (
              // {/* <div className='absolute inset-0 bg-gradient-to-t from-black from-40% to-transparent'></div> */}
              // </div>
              <Image
                src='/fallback.jpeg'
                alt='image'
                width={500}
                height={500}
                className='rounded-lg'
              />
            )}
            <div className='pt-4'>
              <p className='text-2xl'>Artist</p>
              <div className='flex items-center pt-3'>
                <Avatar className='h-14 w-14'>
                  {artist?.image ? (
                    <AvatarImage src={artist?.image} alt='pfp' />
                  ) : (
                    <AvatarFallback></AvatarFallback>
                  )}
                </Avatar>

                <p className='pl-4 text-muted-foreground'>{artist?.name}</p>
                <Link className='ml-auto' href={`/artist/${artist?.id}`}>
                  <Button variant='link'>View Profile</Button>
                </Link>
              </div>
            </div>
            <Separator className='my-6' />
            <p className='text-2xl'>Venue</p>
            <div className='flex items-center pt-3'>
              <p className='text-muted-foreground'>{venue?.name}</p>
              <Link className='ml-auto' href={`/venue/${venue?.id}`}>
                <Button variant='link'>View Venue</Button>
              </Link>
            </div>
            <Separator className='my-6' />
            <p className='text-2xl'>Description</p>
            <div className='space-y-6'>
              <p className='pt-3 text-base text-muted-foreground'>
                {event.description}
              </p>
            </div>
            <Separator className='my-6' />
            {event.etherscan_link ? (
              <a href={`${event.etherscan_link}`} target='_blank'>
                <Button variant='link'>
                  <div className='flex items-center space-x-1.5'>
                    <span className='relative flex h-3 w-3'>
                      {/* Uncomment to animate */}
                      {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span> */}
                      <div className='relative inline-flex h-3 w-3 rounded-full bg-green-600 '></div>
                    </span>
                    <div className='text-muted-foreground'>Contract live</div>
                    <ExternalLinkIcon className='text-muted-foreground' />
                  </div>
                </Button>
              </a>
            ) : (
              <div className='flex items-center space-x-1.5'>
                <span className='relative flex h-3 w-3'>
                  {/* Uncomment to animate */}
                  {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span> */}
                  <div className='relative inline-flex h-3 w-3 rounded-full bg-yellow-500 '></div>
                </span>
                <div className='text-muted-foreground'>
                  Contract pending deployment
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
