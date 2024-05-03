'use client';

import { Ticket, UserProfile } from 'supabase';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { dateToString } from '~/utils/helpers';
import { trpc } from '~/app/_trpc/client';
import { Button } from '~/components/ui/button';
import { AlertCircle, CheckCircle, ScanFace, XCircle } from 'lucide-react';
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
import { useState } from 'react';
import ProfileCard from '~/components/ProfileCard';
import { Badge } from '~/components/ui/badge';
import { Icons } from '~/components/ui/icons';
import UsersListSingle from '~/components/UsersListSingle';
import { Input } from '~/components/ui/input';
import { toast } from 'sonner';

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

  const { data: upcomingEvents } = trpc.getUpcomingEventsForUser.useQuery({
    user_id: userProfile.id,
  });

  const { data: tickets, refetch } = trpc.getTicketsForUser.useQuery({
    user_id: userProfile?.id!,
  });

  const { data: users, isLoading: usersLoading } =
    trpc.getTotalFriendsForUser.useQuery({ username: userProfile.username! });

  const { data: pendingPushRequsts, refetch: refetchPush } =
    trpc.getPendingTicketTransferPushRequests.useQuery();

  const requestTransfer = trpc.requestTransferTicketPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        toast.error(`Error requesting transfer: ${error.message}`);
        console.error('Error requesting transfer: ', error);
      } else {
        await refetch();
        toast.success('Ticket transfer request sent!');
      }
      setIsLoading(false);
      setDialogOpen(null); // Close the dialog
      setSelectedUsers(null);
    },
  });

  const cancelRequestTransfer = trpc.cancelTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        toast.error(`Error canceling transfer: ${error.message}`);
        console.error('Error canceling transfer: ', error);
      } else {
        await refetch();
        toast.success('Ticket transfer request canceled!');
      }
      setIsLoading(false);
      setDialogOpen(null);
    },
  });

  const rejectTransfer = trpc.rejectTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        toast.error(`Error rejecting transfer: ${error.message}`);
        console.error('Error rejecting transfer: ', error);
      } else {
        await refetchPush();
        toast.success('Ticket transfer request rejected!');
      }
      setIsLoading(false);
      setDialogOpen(null);
    },
  });

  const acceptTransfer = trpc.acceptTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        toast.error(`Error accepting transfer: ${error.message}`);
        console.error('Error accepting transfer: ', error);
      } else {
        await refetchPush();
        toast.success('Ticket transfer request accepted!');
      }
      setIsLoading(false);
      setDialogOpen(null);
    },
  });

  const renderTicketRequest = (pending: any) => {
    if (pending.status === 'accepted') {
      return (
        <div className='flex flex-col gap-2'>
          <Link
            href={`/${pending.to_profile.username}`}
            className='flex flex-col gap-2'
          >
            <ProfileCard userProfile={pending.to_profile} />
          </Link>
          <div className='flex flex-row items-center gap-2 font-light text-green-500'>
            <Badge className='w-full justify-center gap-2 bg-green-800/40 text-green-400 hover:bg-green-800/20'>
              <p>Accepted</p>
              <CheckCircle className='h-3 w-3' />
            </Badge>
          </div>
        </div>
      );
    } else if (pending.status === 'rejected') {
      return (
        <div className='flex flex-row items-center gap-2 font-light text-red-500'>
          <AlertCircle className='h-4 w-4' />
          <p>Rejected</p>
        </div>
      );
    } else if (pending.status === 'pending') {
      return (
        <div className='flex flex-col gap-2'>
          <Link
            href={`/${pending.to_profile.username}`}
            className='flex flex-row items-center gap-2'
          >
            <ProfileCard userProfile={pending.to_profile} />
          </Link>

          <div className='flex flex-row items-center justify-between gap-8 text-yellow-500'>
            <div className='flex flex-row items-center gap-2 '>
              <Badge className=' gap-2 bg-yellow-800/40 text-yellow-400 hover:bg-yellow-800/20'>
                <p>Pending</p>
                {/* <CircleEllipsis className='h-4 w-4' /> */}
              </Badge>
            </div>

            <Dialog
              open={dialogOpen === pending.ticket_id} // Only open the dialog if its id matches with dialogOpen state
              onOpenChange={(isOpen) => {
                if (!isOpen) setDialogOpen(null); // Close the dialog
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='flex flex-row items-center gap-2'
                  onClick={() => setDialogOpen(pending.ticket_id)}
                >
                  <XCircle className='h-4 w-4' />
                  Cancel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Transfer Request</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this transfer request?
                  </DialogDescription>
                </DialogHeader>

                <div className='flex w-full flex-row justify-end space-x-2 pt-4'>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      setDialogOpen(null);
                    }}
                  >
                    No
                  </Button>
                  <Button
                    disabled={isLoading}
                    className=''
                    onClick={() => {
                      setIsLoading(true);
                      cancelRequestTransfer.mutate({
                        ticket_id: pending.ticket_id,
                      });
                    }}
                  >
                    {isLoading && (
                      <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Yes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }
  };

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
              <div>
                <Link href={`/${userProfile.username}/id`}>
                  <Button className='mb-4 w-full rounded-md'>
                    <div className='flex flex-row items-center gap-2'>
                      <p>Scan In</p>
                      <ScanFace />
                    </div>
                  </Button>
                </Link>
                <div className='grid grid-cols-1 gap-y-2'>
                  {upcomingEvents?.map((event) => (
                    <div key={event?.id}>
                      <Accordion type='single' collapsible>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>
                            <div className='flex w-full flex-row items-center gap-4'>
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
                          </AccordionTrigger>
                          <AccordionContent>
                            {tickets?.tickets
                              ?.filter(
                                (ticket) => ticket.owner_id !== userProfile.id,
                              )
                              ?.filter((ticket) => ticket.event_id === event.id)
                              ?.map((ticket: Ticket, index: number) => (
                                <div
                                  key={ticket.id}
                                  className='flex flex-row items-center justify-between border-b px-2 py-2'
                                >
                                  <div className='flex items-center gap-8 font-medium'>
                                    <div className='flex flex-col'>
                                      <p>
                                        {tickets.tickets![index]?.events?.name}
                                      </p>
                                      <p className='text-sm font-extralight text-muted-foreground'>
                                        {ticket.seat}
                                      </p>
                                    </div>
                                  </div>

                                  {tickets.pushRequestTickets?.find(
                                    (ticketFind) =>
                                      ticketFind.ticket_id === ticket.id,
                                  ) ? (
                                    renderTicketRequest(
                                      tickets.pushRequestTickets?.find(
                                        (ticketFind) =>
                                          ticketFind.ticket_id === ticket.id,
                                      ),
                                    )
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
                                          className='text-red-500'
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
                                            className='w-full'
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
                                          users={users}
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
