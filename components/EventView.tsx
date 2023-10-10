import { serverClient } from '@/app/_trpc/serverClient';
import createServerClient from '@/lib/supabaseServer';
import Image from 'next/image';
import EventPurchase from './EventPurchase';
import { Button } from './ui/button';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { dateToString } from '@/utils/helpers';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default async function EventView({
  params,
}: {
  params: { id: string };
}) {
  const event = await serverClient.getEventById({ id: params.id });

  if (!event) {
    notFound();
  }

  const artist = await serverClient.getArtistById({ id: event.artist });

  const venue = await serverClient.getVenueById({ id: event.venue });

  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // const userProfile = await serverClient.getUserProfile({ id: user?.id });

  return (
    <div className='bg-background'>
      <div className='px-4 pt-9 md:px-16'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7 flex w-full items-center justify-center overflow-hidden rounded-lg bg-background'>
            {event.image ? (
              <Image
                src={event.image!}
                alt={event.description}
                width={500}
                height={500}
                className='rounded-lg'
              />
            ) : (
              <Image
                src='/fallback.jpeg'
                alt='image'
                width={500}
                height={500}
                className='rounded-lg'
              />
            )}
          </div>

          <div>
            <div className='lg:border-rlg:pr-8 lg:col-span-2'>
              <h1 className='text-8xl'>{event.name}</h1>
            </div>

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

            <Separator className='my-6' />
            <p className='text-2xl'>Date</p>
            <div className='space-y-6'>
              <p className='pt-3 text-base text-muted-foreground'>
                {dateToString(event.date)}
              </p>
            </div>
            <Separator className='my-6' />
            <div>
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

            <div className='lg:border-rlg:pb-16 lg:col-span-2 lg:col-start-1'>
              <div>
                <EventPurchase user={user} event={event} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
