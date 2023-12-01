import { UserProfile } from 'supabase';
import { serverClient } from '../_trpc/serverClient';
import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function TicketList({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const userTicketsUpcoming = await serverClient.getTicketsForUser
    .query({
      user_id: userProfile?.id!,
    })
    .then((res) => res?.filter((ticket) => !ticket.scanned));
  const userTicketsPast = await serverClient.getTicketsForUser
    .query({
      user_id: userProfile?.id!,
    })
    .then((res) => res?.filter((ticket) => ticket.scanned));

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <Tabs defaultValue='upcoming' className='items-center'>
        <TabsList className='-ml-4 items-center justify-center '>
          <TabsTrigger value='upcoming'>Upcoming Events</TabsTrigger>
          <TabsTrigger value='Past'>Past Events</TabsTrigger>
        </TabsList>
        {/* <Card className='bg-zinc-950'>
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              It may take recently purchased tickets a few seconds to appear as
              the payment processes and your token is transferred to your wallet
              on chain. If you don&apos;t see it immediately, please wait 30
              seconds and refresh the page.
            </p>
          </CardContent>
        </Card> */}

        <TabsContent value='upcoming' className='py-6'>
          <div>
            {userTicketsUpcoming?.length != 0 ? (
              <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
                {userTicketsUpcoming?.map((ticket) => (
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
                          className='h-full w-full object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75'
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
                  </a>
                ))}
              </div>
            ) : (
              <div>
                <p className='pt-12 text-3xl'>No upcoming events</p>
                <p className='pt-2 font-light text-muted-foreground'>
                  Check out the events page to explore upcoming events
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value='Past' className='py-6'>
          <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
            {userTicketsPast ? (
              <>
                {userTicketsPast.map((ticket) => (
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
                  </a>
                ))}
              </>
            ) : (
              <div></div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
