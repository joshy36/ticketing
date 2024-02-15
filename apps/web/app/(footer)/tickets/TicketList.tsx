'use client';

import { UserProfile } from 'supabase';
import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { dateToString } from '@/utils/helpers';
import { trpc } from '@/app/_trpc/client';

export default function TicketList({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const { data: upcomingEvents } = trpc.getUpcomingEventsForUser.useQuery({
    user_id: userProfile.id,
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <Tabs defaultValue='upcoming' className='items-center'>
        <TabsList className='-ml-4 items-center justify-center'>
          <TabsTrigger
            value='upcoming'
            className='text-sm font-semibold md:text-sm'
          >
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger
            value='Past'
            className='text-sm font-semibold md:text-sm'
          >
            Past Events
          </TabsTrigger>
        </TabsList>
        <TabsContent value='upcoming' className='py-6'>
          <div>
            {upcomingEvents?.length != 0 ? (
              <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
                {upcomingEvents?.map((event) => (
                  <a
                    key={event?.id}
                    href={`tickets/${event?.id}`}
                    className='group'
                  >
                    <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background'>
                      {event?.image ? (
                        <Image
                          src={event.image}
                          alt='Event Image'
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
                    <h1 className='mt-2 text-xl text-accent-foreground'>
                      {event?.name}
                    </h1>
                    <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
                      {`${dateToString(event?.date!)}`}
                    </p>
                    <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
                      {`${event?.venues.name}`}
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
          {/* <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
            {userTicketsPast ? (
              <>
                {userTicketsPast.map((ticket) => (
                  <a
                    key={ticket.id}
                    href={`tickets/${ticket.id}`}
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
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
