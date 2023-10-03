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

  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = await serverClient.getUserProfile({ id: user?.id });

  return (
    <div className="bg-background">
      <div className="pt-9 px-16">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center justify-center aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-background xl:aspect-h-8 xl:aspect-w-7">
            {event.image ? (
              <Image
                src={event.image!}
                alt={event.description}
                width={500}
                height={500}
                className="rounded-lg"
              />
            ) : (
              <Image
                src="/fallback.jpeg"
                alt="image"
                width={500}
                height={500}
                className="rounded-lg"
              />
            )}
          </div>

          <div>
            <div className="lg:col-span-2 lg:border-rlg:pr-8">
              <h1 className="text-8xl">{event.name}</h1>
            </div>

            {event.etherscan_link ? (
              <a href={`${event.etherscan_link}`} target="_blank">
                <Button variant="ghost">
                  <div className="flex items-center space-x-1.5">
                    <span className="relative flex h-3 w-3">
                      {/* Uncomment to animate */}
                      {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span> */}
                      <div className="relative inline-flex rounded-full h-3 w-3 bg-green-600 "></div>
                    </span>
                    <div className="text-muted-foreground">Contract live</div>
                    <ExternalLinkIcon className="text-muted-foreground" />
                  </div>
                </Button>
              </a>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="relative flex h-3 w-3">
                  {/* Uncomment to animate */}
                  {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span> */}
                  <div className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500 "></div>
                </span>
                <div className="text-muted-foreground">
                  Contract pending deployment
                </div>
              </div>
            )}

            <Separator className="my-6" />
            <p className="text-2xl">Date</p>
            <div className="space-y-6">
              <p className="text-base text-muted-foreground">
                {dateToString(event.date)}
              </p>
            </div>
            <Separator className="my-6" />
            <div>
              <p className="text-2xl">Artist</p>
              <div className="flex items-center pt-3">
                <Image
                  src={artist?.image!}
                  alt={artist?.description!}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <p className="pl-2">{artist?.name}</p>
                <Link className="ml-auto" href={`/artist/${artist?.id}`}>
                  <Button>View Profile</Button>
                </Link>
              </div>
            </div>
            <Separator className="my-6" />
            <p className="text-2xl">Venue</p>
            <div className="space-y-6">
              <p className="text-base text-muted-foreground">{`${event.location}`}</p>
            </div>
            <Separator className="my-6" />
            <p className="text-2xl">Description</p>
            <div className="space-y-6">
              <p className="text-base text-muted-foreground">
                {event.description}
              </p>
            </div>
            <Separator className="my-6" />

            <div className="lg:col-span-2 lg:col-start-1 lg:border-rlg:pb-16">
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
