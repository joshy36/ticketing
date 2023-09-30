import { serverClient } from '@/app/_trpc/serverClient';
import createServerClient from '@/lib/supabaseServer';
import Image from 'next/image';
import EventPurchase from './EventPurchase';
import { Button } from './ui/button';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { dateToString } from '@/utils/helpers';

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
      <div className="pt-6 px-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="justify-center aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-background xl:aspect-h-8 xl:aspect-w-7">
            {event?.image ? (
              <Image
                src={event?.image!}
                alt={event?.description!}
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
                  <p className="text-base text-accent-foreground">
                    {dateToString(event?.date!)}
                  </p>
                </div>
                <div className="space-y-6">
                  <p className="text-base text-accent-foreground">{`${event?.location}`}</p>
                </div>

                {event?.etherscan_link ? (
                  <a href={`${event.etherscan_link}`} target="_blank">
                    <Button variant="ghost">
                      <div className="flex items-center space-x-1.5">
                        <span className="relative flex h-3 w-3">
                          {/* Uncomment to animate */}
                          {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span> */}
                          <div className="relative inline-flex rounded-full h-3 w-3 bg-green-600 "></div>
                        </span>
                        <div className="text-muted-foreground">
                          Contract deployed
                        </div>
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
                <EventPurchase user={user} event={event} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
