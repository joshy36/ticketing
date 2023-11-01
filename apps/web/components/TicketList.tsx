import { UserProfile } from 'supabase';
import { serverClient } from '../../../apps/web/app/_trpc/serverClient';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default async function TicketList({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const userTickets = await serverClient.getTicketsForUser({
    user_id: userProfile?.id!,
  });

  return (
    <div className='flex flex-col items-center justify-center'>
      <Tabs defaultValue='upcoming' className=''>
        <TabsList className='items-center justify-center'>
          <TabsTrigger value='upcoming'>Upcoming Events</TabsTrigger>
          <TabsTrigger value='Past'>Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value='upcoming' className='py-6'>
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
                  </a>
                ))}
              </>
            ) : (
              <div>No upcoming events!</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value='Past' className='py-6'>
          Need to update
        </TabsContent>
      </Tabs>
    </div>
  );
}
