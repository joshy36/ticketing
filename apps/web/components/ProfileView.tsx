import createServerClient from '@/utils/supabaseServer';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { serverClient } from '../../../apps/web/app/_trpc/serverClient';
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
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className='bg-background'>
      <div className='pt-6'>
        <div className='flex justify-center'>
          <Avatar className='h-40 w-40'>
            {userProfile?.profile_image ? (
              <AvatarImage src={userProfile?.profile_image!} alt='pfp' />
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Product info */}
        <div className='mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16'>
          <div className='lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8'>
            <h1 className='text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl'>
              {`@${userProfile?.username}`}
            </h1>
          </div>

          {/* Options */}
          <div className='mt-4 lg:row-span-3 lg:mt-0'>
            {/* <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-accent-foreground">{`$99999`}</p> */}
            {session?.user! && session?.user.id === params.id ? (
              <form className='mt-10'>
                <Link href={`/user/edit/${params.id}`}>
                  <Button variant='default' className='flex w-full'>
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

          <div className='py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6'>
            {/* Description and details */}
            <div>
              <h3 className='sr-only'>Description</h3>
              <div className='inline-block space-y-6'>
                {userProfile?.first_name ? (
                  <p className='inline text-base text-accent-foreground'>{`${userProfile.first_name} `}</p>
                ) : (
                  <p></p>
                )}
                {userProfile?.last_name ? (
                  <p className='inline text-base text-accent-foreground'>{`${userProfile.last_name}`}</p>
                ) : (
                  <p></p>
                )}
              </div>
              <div className='space-y-6'>
                <p className='text-base text-accent-foreground'>
                  {userProfile?.bio}
                </p>
              </div>
            </div>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl'>
            Upcoming Events
          </h1>
        </div>
        <div className='mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='sr-only'>Tickets</h2>
          <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
            {userTickets ? (
              <>
                {userTickets.map((ticket) => (
                  <a
                    key={ticket.id}
                    href={`/ticket/${ticket.id}`}
                    className='group'
                  >
                    <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background'>
                      {ticket.events?.image ? (
                        <Image
                          src={ticket.events?.image}
                          alt='Ticket Image'
                          width={500}
                          height={500}
                          className='h-full w-full object-cover object-center group-hover:opacity-75'
                        />
                      ) : (
                        <Image
                          src='/fallback.jpeg'
                          alt='image'
                          width={500}
                          height={500}
                          className='h-full w-full object-cover object-center group-hover:opacity-75'
                        />
                      )}
                    </div>
                    <h1 className='mt-4 text-lg text-accent-foreground'>
                      {ticket.events?.name}
                    </h1>
                    <p className='font-sm mt-1 text-sm text-muted-foreground'>
                      {`Seat: ${ticket.seat}`}
                    </p>
                    {/* Need event id */}
                    {/* <a
                      href={`https://goerli.basescan.org/token/${ticket.events?.etherscan_link}?a=${ticket.token_id}`}
                      target="_blank"
                    >
                      <p className="text-muted-foreground">
                        Link
                        <ExternalLinkIcon className="text-muted-foreground" />
                      </p>
                    </a> */}
                  </a>
                ))}
              </>
            ) : (
              <div>No upcoming events!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
