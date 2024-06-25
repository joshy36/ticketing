'use client';

import { UserProfile } from 'supabase';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { dateToString } from '~/utils/helpers';
import { trpc } from '~/app/_trpc/client';
import { Button } from '~/components/ui/button';
import { AlertCircle, ScanFace, X } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { useContext, useState } from 'react';
import ProfileCard from '~/components/ProfileCard';
import { Badge } from '~/components/ui/badge';
import { Icons } from '~/components/ui/icons';
import UsersListSingle from '~/components/UsersListSingle';
import { Input } from '~/components/ui/input';
import { toast } from 'sonner';
import RenderTicketRequest from './RenderTicketRequest';
import AcceptTickets from './AcceptTickets';
import { TicketsContext } from '~/providers/ticketsProvider';
import { RouterOutputs } from 'api';
import TicketListSkeleton from './TicketListSkeleton';

export default function TicketList({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[] | null>(
    null,
  );
  const [userSearch, setUserSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { pendingPushRequsts, refetchPush, tickets, refetchTickets } =
    useContext(TicketsContext);

  function extractUniqueEvents(
    tickets: RouterOutputs['getTicketsForUser'] | null | undefined,
  ) {
    const uniqueEventsMap = new Map();

    tickets?.tickets?.forEach((ticket) => {
      uniqueEventsMap.set(ticket?.events?.id, ticket.events);
    });

    return Array.from(uniqueEventsMap.values());
  }

  const uniqueEvents = extractUniqueEvents(tickets);

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = trpc.getTotalFriendsForUser.useQuery({ username: userProfile.username! });

  const requestTransfer = trpc.requestTransferTicketPush.useMutation({
    onSettled: async (data, error) => {
      await refetchTickets();
      await refetchUsers();
      if (error) {
        toast.error(`Error requesting transfer: ${error.message}`);
        console.error('Error requesting transfer: ', error);
      } else {
        toast.success('Ticket transfer request sent!');
      }
      setIsLoading(false);
      setDialogOpen(null); // Close the dialog
      setSelectedUsers(null);
    },
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
          <AcceptTickets
            pendingPushRequsts={pendingPushRequsts}
            refetchPush={refetchPush}
            refetchTickets={refetchTickets}
          />
          <div>
            <Link href={`/${userProfile.username}/id`}>
              <Button className='mb-4 w-full'>
                <div className='flex flex-row items-center gap-2'>
                  <ScanFace />
                  <p>Scan In</p>
                </div>
              </Button>
            </Link>
            {uniqueEvents?.length != 0 ? (
              <div>
                <div className='grid grid-cols-1'>
                  {uniqueEvents?.map((event) => (
                    <div key={event?.id}>
                      <Accordion type='single' collapsible>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger className='hover:bg-zinc-800/50 hover:no-underline'>
                            <div className='flex w-full flex-row items-center justify-between'>
                              <div className='flex flex-row gap-4'>
                                <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-24 overflow-hidden rounded-lg bg-background'>
                                  {event?.image ? (
                                    <Image
                                      src={event.image}
                                      alt='Event Image'
                                      width={500}
                                      height={500}
                                      className='h-full w-full object-cover object-center'
                                    />
                                  ) : (
                                    <Image
                                      src='/fallback.jpeg'
                                      alt='image'
                                      width={500}
                                      height={500}
                                      className='h-full w-full object-cover object-center'
                                    />
                                  )}
                                </div>
                                <div>
                                  <h1 className='mt-2 text-start text-xl text-accent-foreground'>
                                    {event?.name}
                                  </h1>
                                  <p className='font-sm mt-0.5 text-start text-sm font-light text-muted-foreground'>
                                    {`${dateToString(event?.date!)}`}
                                  </p>
                                  <p className='font-sm mt-0.5 text-start text-sm font-light text-muted-foreground'>
                                    {`${event?.venues.name}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {tickets?.tickets
                              ?.filter((ticket) => ticket.event_id === event.id)
                              ?.filter(
                                (ticket) => ticket.owner_id !== userProfile.id,
                              )
                              ?.some(
                                (ticket) =>
                                  !tickets.pushRequestTickets?.find(
                                    (ticketFind) =>
                                      ticketFind.ticket_id === ticket.id,
                                  ),
                              ) && (
                              <div className='mr-4 flex flex-row items-center gap-1 text-red-600'>
                                <Badge className='w-full justify-center gap-2 bg-red-800/40 text-red-600 hover:bg-red-800/20'>
                                  <AlertCircle className='h-4 w-4' />
                                  <p className='text-base font-normal'>
                                    Transfer
                                  </p>
                                </Badge>
                              </div>
                            )}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className='flex flex-row items-center justify-between border-b px-4 py-2'>
                              {
                                tickets?.tickets?.filter(
                                  (ticket) =>
                                    ticket.owner_id === userProfile.id,
                                )[0]?.seat
                              }

                              {tickets?.tickets?.filter(
                                (ticket) => ticket.owner_id === userProfile.id,
                              ).length != 0 && <p>Your Ticket</p>}
                            </div>
                            {tickets?.tickets
                              ?.filter((ticket) => ticket.event_id === event.id)
                              ?.filter(
                                (ticket) => ticket.owner_id !== userProfile.id,
                              )
                              ?.map((ticket: any, index: number) => (
                                <div
                                  key={ticket.id}
                                  className='flex flex-row items-center justify-between border-b px-4 py-2'
                                >
                                  <div className='flex items-center gap-8 font-medium'>
                                    <div className='flex flex-col'>
                                      <p className=' '>{ticket.seat}</p>
                                    </div>
                                  </div>

                                  {tickets.pushRequestTickets?.find(
                                    (ticketFind) =>
                                      ticketFind.ticket_id === ticket.id,
                                  ) ? (
                                    <RenderTicketRequest
                                      pending={tickets.pushRequestTickets?.find(
                                        (ticketFind) =>
                                          ticketFind.ticket_id === ticket.id,
                                      )}
                                      isLoading={isLoading}
                                      setIsLoading={setIsLoading}
                                      refetchTickets={refetchTickets}
                                      refetchUsers={refetchUsers}
                                    />
                                  ) : (
                                    <Dialog
                                      open={dialogOpen === ticket.id} // Only open the dialog if its id matches with dialogOpen state
                                      onOpenChange={(isOpen) => {
                                        if (!isOpen) setDialogOpen(null); // Close the dialog
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          variant='outline'
                                          onClick={() =>
                                            setDialogOpen(ticket.id)
                                          }
                                          className='border-red-600 text-red-600 hover:bg-red-900/30 hover:text-red-600'
                                        >
                                          <div className='flex flex-row items-center gap-2'>
                                            <AlertCircle className='h-4 w-4' />
                                            Transfer
                                          </div>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Transfer Ticket
                                          </DialogTitle>
                                          <DialogDescription>
                                            Select a user to transfer the ticket
                                            to. You must be friends with someone
                                            to send them a ticket. You can find
                                            people using the search bar to send
                                            them a friend request.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className='flex flex-col flex-wrap'>
                                          {selectedUsers?.map((user) => {
                                            return (
                                              <div
                                                key={user.id}
                                                className='mx-2 my-1 rounded-full border p-2'
                                              >
                                                <ProfileCard
                                                  userProfile={user}
                                                />
                                              </div>
                                            );
                                          })}
                                        </div>
                                        <div className='flex w-full flex-row space-x-2 pt-4'>
                                          <Input
                                            type='text'
                                            placeholder='Search'
                                            className='rounded-full text-muted-foreground'
                                            onChange={(e) =>
                                              setUserSearch(e.target.value)
                                            }
                                          />
                                          <Button
                                            disabled={
                                              isLoading ||
                                              !selectedUsers?.length
                                            }
                                            className='w-56'
                                            onClick={() => {
                                              setIsLoading(true);
                                              requestTransfer.mutate({
                                                to: selectedUsers![0]!.id,
                                                ticket_id: ticket.id,
                                              });
                                            }}
                                          >
                                            {isLoading && (
                                              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                                            )}
                                            Transfer Ticket
                                          </Button>
                                        </div>
                                        <UsersListSingle
                                          users={users
                                            ?.filter(
                                              (user) =>
                                                !user.tickets.some(
                                                  (ticket) =>
                                                    ticket.event_id ===
                                                    event.id,
                                                ) &&
                                                !user.ticket_transfer_push_requests.some(
                                                  (request) =>
                                                    request.status ===
                                                      'pending' &&
                                                    request?.tickets
                                                      ?.event_id === event.id,
                                                ),
                                            )
                                            .map((user) => user.profile)}
                                          usersLoading={usersLoading}
                                          userProfile={userProfile}
                                          userSearch={userSearch}
                                          selectedUsers={selectedUsers}
                                          setSelectedUsers={setSelectedUsers}
                                        />
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {!uniqueEvents ? (
                  <div>
                    <p className='pt-12 text-3xl'>No upcoming events</p>
                    <p className='pt-2 font-light text-muted-foreground'>
                      Check out the events page to explore upcoming events
                    </p>
                  </div>
                ) : (
                  <div>
                    <TicketListSkeleton />
                    <TicketListSkeleton />
                    <TicketListSkeleton />
                  </div>
                )}
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
