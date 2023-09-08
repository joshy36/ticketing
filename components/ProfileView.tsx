import createServerClient from '@/lib/supabaseServer';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { serverClient } from '@/app/_trpc/serverClient';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default async function ProfileView({
  params,
}: {
  params: { id: string };
}) {
  const userProfile = await serverClient.getUserProfile({ id: params.id });

  const userTickets = await serverClient.getTicketsForUser({
    user_id: userProfile?.id!,
  });

  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-background">
      <div className="pt-6">
        <div className="flex justify-center">
          <Avatar className="h-40 w-40">
            {userProfile?.profile_image ? (
              <AvatarImage src={userProfile?.profile_image!} alt="pfp" />
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl">
              {`@${userProfile?.username}`}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            {/* <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-accent-foreground">{`$99999`}</p> */}
            {user! && user.id === params.id ? (
              <form className="mt-10">
                <Link href={`/user/edit/${params.id}`}>
                  <Button variant="default" className="flex w-full">
                    Edit Profile
                  </Button>
                </Link>
              </form>
            ) : (
              <div></div>
            )}
            {/* <form className="mt-10">
              <Link href={`/user/edit/${params.id}`}>
                <Button variant="default" className="flex w-full">
                  Edit Profile
                </Button>
              </Link>
            </form> */}
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 inline-block">
                {userProfile?.first_name ? (
                  <p className="text-base text-accent-foreground inline">{`${userProfile.first_name} `}</p>
                ) : (
                  <p></p>
                )}
                {userProfile?.last_name ? (
                  <p className="text-base text-accent-foreground inline">{`${userProfile.last_name}`}</p>
                ) : (
                  <p></p>
                )}
              </div>
              <div className="space-y-6">
                <p className="text-base text-accent-foreground">
                  {userProfile?.bio}
                </p>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl">
            Upcoming Events
          </h1>
        </div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Tickets</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {userTickets ? (
              <div>
                {userTickets.map((ticket) => (
                  <a
                    key={ticket.id}
                    // href={`/event/${ticket.id}`}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-background xl:aspect-h-8 xl:aspect-w-7">
                      {ticket.events?.image ? (
                        <Image
                          src={ticket.events?.image}
                          alt="Ticket Image"
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
                    <h1 className="mt-4 text-lg text-accent-foreground">
                      {ticket.events?.name}
                    </h1>
                    <p className="mt-1 text-sm font-sm text-accent-foreground">
                      {`Seat: ${ticket.seat}`}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <div>No upcoming events!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
