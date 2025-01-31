import { serverClient } from '../../../_trpc/serverClient';
import createSupabaseServer from '~/utils/supabaseServer';
import Image from 'next/image';
import EventPurchase from './EventPurchase';
import { Button } from '~/components/ui/button';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { dateToString } from '~/utils/helpers';
import { Separator } from '~/components/ui/separator';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

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
  const supabase = createSupabaseServer();
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
      <div className='py-16 md:px-16'>
        <div className='text-center lg:col-span-2'>
          <h1 className='text-4xl font-medium lg:text-6xl'>{event.name}</h1>
        </div>
        <div className='space-y-6 text-center'>
          <p className='py-3 font-light text-muted-foreground lg:text-xl'>
            {dateToString(event.date)}
          </p>
        </div>
        <div className='grid grid-cols-1 justify-center gap-8 pt-6 md:max-w-[1000px] md:grid-cols-2'>
          <div>
            <Card className='sticky top-24 border bg-zinc-950 p-2 shadow-xl shadow-black'>
              <CardHeader className='text-2xl font-bold lg:text-3xl'>
                Buy Tickets
              </CardHeader>
              <CardContent>
                <EventPurchase userProfile={userProfile} event={event} />
              </CardContent>
            </Card>
          </div>
          <div>
            <div>
              <p className='text-2xl font-semibold'>Description</p>
              <div className='space-y-6'>
                <p className='pt-3 text-base font-light text-muted-foreground'>
                  {event.description}
                </p>
              </div>
              <Separator className='my-6' />
              <p className='text-2xl font-semibold'>Artist</p>
              <div className='flex items-center pt-4'>
                <Avatar className='h-14 w-14'>
                  {artist?.image ? (
                    <AvatarImage src={artist?.image} alt='pfp' />
                  ) : (
                    <AvatarFallback></AvatarFallback>
                  )}
                </Avatar>

                <p className='pl-4 font-light text-muted-foreground'>
                  {artist?.name}
                </p>
                <Link className='ml-auto' href={`/artist/${artist?.id}`}>
                  <Button variant='outline'>View Profile</Button>
                </Link>
              </div>
            </div>
            <Separator className='my-6' />
            <p className='text-2xl font-semibold'>Venue</p>
            <div className='flex items-center pt-3'>
              <p className='font-light text-muted-foreground'>{venue?.name}</p>
              <Link className='ml-auto' href={`/venue/${venue?.id}`}>
                <Button variant='outline'>View Venue</Button>
              </Link>
            </div>
            <Separator className='my-6' />
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
          </div>
        </div>
      </div>
    </div>
  );
}
