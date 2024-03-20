'use client';

import { RouterOutputs, trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Ticket, UserProfile } from 'supabase';
import QRCode from 'react-qr-code';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import { dateToString } from '@/utils/helpers';
import { Separator } from '../../../../components/ui/separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar';
import { AlertCircle, CheckCircle } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import UsersList from '@/components/UsersList';
import { useRouter } from 'next/navigation';

export function TicketView({
  tickets,
  userProfile,
  event_id,
  usersWithoutTickets,
}: {
  tickets: RouterOutputs['getTicketsForUserByEvent'];
  userProfile: UserProfile;
  event_id: string;
  usersWithoutTickets: RouterOutputs['getUsersWithoutTicketsForEvent'];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qr, setQR] = useState<string>('');
  const [front, setFront] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[] | null>(
    null,
  );
  const [userSearch, setUserSearch] = useState<string>('');
  const router = useRouter();

  const ownedTicket = tickets.ownedTicket;

  const { data: event } = trpc.getEventById.useQuery({ id: event_id });
  const { data: artist } = trpc.getArtistById.useQuery(
    { id: event?.artist! },
    { enabled: !!event },
  );
  const { data: venue } = trpc.getVenueById.useQuery(
    { id: event?.venue! },
    { enabled: !!event },
  );
  const activateTicket = trpc.generateTicketQRCode.useMutation({
    onSettled(data, error) {
      if (error) {
        if (error.message === 'Ticket already activated!') {
          toast.error('Ticket already activated, try refreshing the page!');
        } else {
          toast.error('Error activating ticket');
        }
        console.error('Error activating ticket:', error);
        setIsLoading(false);
      } else {
        // router.refresh();
        toast.success('Ticket activated!');

        setIsLoading(false);
        setQR(data!);
        ownedTicket!.qr_code = data!;
      }
    },
  });

  const transferTicket = trpc.transferTicketDatabase.useMutation({
    onSettled(data, error) {
      if (error) {
        toast.error('Error transferring ticket');
        console.error('Error transferring ticket:', error);
        setIsLoading(false);
      } else {
        toast.success('Ticket transferred!');
        setIsLoading(false);
      }
    },
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-col items-center justify-center'>
        <div
          key={ownedTicket?.id}
          className='flex flex-col items-center justify-center'
        >
          <div className='flex flex-row items-center justify-between gap-16 pb-4'>
            <Button
              variant='secondary'
              className='rounded-md'
              onClick={() => setFront(!front)}
            >
              Flip
            </Button>
          </div>
          {front ? (
            <Card className='w-[350px] border bg-zinc-950'>
              <CardHeader>
                <CardTitle>{ownedTicket?.events?.name}</CardTitle>
                <CardDescription>
                  {' '}
                  {`Seat: ${ownedTicket!.seat}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='bg-background '>
                  {ownedTicket!.events?.image ? (
                    <Image
                      src={ownedTicket!.events?.image!}
                      alt='Ticket Image'
                      width={500}
                      height={500}
                      className=''
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

                {qr ? (
                  <div className='flex items-center justify-center bg-white p-4'>
                    <QRCode value={qr} />
                  </div>
                ) : (
                  <div className='pt-4'>
                    <Button
                      disabled={isLoading}
                      className='w-full'
                      onClick={() => {
                        setIsLoading(true);

                        activateTicket.mutate({
                          user_id: userProfile.id,
                          ticket_id: ownedTicket!.id,
                        });
                      }}
                    >
                      Activate
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex'>
                <p className='text-sm font-light text-muted-foreground'>
                  {dateToString(ownedTicket?.events?.date!)}
                </p>
              </CardFooter>
            </Card>
          ) : (
            <Card className='w-[350px] border bg-zinc-950'>
              <CardHeader>
                <CardTitle>{ownedTicket?.events?.name}</CardTitle>
                <CardDescription>
                  {' '}
                  {`Seat: ${ownedTicket!.seat}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='bg-zinc-950 p-2 '>
                  <div>
                    <p className='pb-4 text-2xl'>Artist</p>

                    <div className='flex flex-row items-center justify-start'>
                      <Avatar className='h-14 w-14'>
                        {artist?.image ? (
                          <AvatarImage src={artist?.image} alt='pfp' />
                        ) : (
                          <AvatarFallback></AvatarFallback>
                        )}
                      </Avatar>
                      <p className='pl-4 text-muted-foreground'>
                        {artist?.name}
                      </p>
                    </div>
                  </div>
                  <Separator className='my-6' />
                  <p className='pb-4 text-2xl'>Venue</p>

                  <p className='text-muted-foreground'>{venue?.name}</p>
                </div>
              </CardContent>
              <CardFooter className='flex'>
                <p className='text-sm font-light text-muted-foreground'>
                  {dateToString(ownedTicket?.events?.date!)}
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
        <div className='flex max-w-[600px] flex-col justify-center pt-6'>
          {tickets.tickets?.filter(
            (ticket) => ticket.owner_id !== userProfile.id,
          ).length! > 0 && (
            <div>
              <h1 className='text-xl font-bold'>Transferable Tickets</h1>
              <p className='pb-4 text-sm font-light text-muted-foreground'>
                You must transfer these tickets to their respective owners
                before the event begins for them to be allowed entry. This will
                allow us to verify that the person entering the event is the
                rightful owner of the ticket.
              </p>
            </div>
          )}
          {tickets.tickets
            ?.filter((ticket) => ticket.owner_id !== userProfile.id)
            ?.map((ticket: Ticket, index: number) => (
              <div
                key={ticket.id}
                className={index % 2 === 0 ? 'gap-4 bg-black' : 'bg-zinc-950'}
              >
                <div className='flex flex-row justify-between border-b px-2 py-2'>
                  <div className='flex items-center gap-8 font-medium'>
                    <p>{ticket.seat}</p>

                    {ticket.owner_id ? (
                      <div className='flex flex-row items-center gap-2 font-light text-green-500'>
                        <CheckCircle className='h-4 w-4' />
                        Transfered
                      </div>
                    ) : (
                      <div className='flex flex-row items-center gap-2 font-light text-yellow-500'>
                        <AlertCircle className='h-4 w-4' />
                        Not transferred
                      </div>
                    )}
                  </div>

                  {ticket.owner_id ? (
                    <Link href={`/${tickets.ownerProfiles[index]?.username}`}>
                      <ProfileCard
                        userProfile={tickets.ownerProfiles[index]!}
                      />
                    </Link>
                  ) : (
                    <Dialog
                      open={dialogOpen === ticket.id} // Only open the dialog if its id matches with dialogOpen state
                      onOpenChange={(isOpen) => {
                        if (!isOpen) setDialogOpen(null); // Close the dialog
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant='secondary'
                          onClick={() => setDialogOpen(ticket.id)}
                        >
                          Transfer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transfer Ticket</DialogTitle>
                          <DialogDescription>
                            Select a user to transfer the ticket to.
                          </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col flex-wrap'>
                          {selectedUsers?.map((user) => {
                            return (
                              <div
                                key={user.id}
                                className='mx-2 my-1 rounded-full border p-2'
                              >
                                <ProfileCard userProfile={user} />
                              </div>
                            );
                          })}
                        </div>
                        <div className='flex w-full flex-row space-x-2 pt-4'>
                          <Input
                            type='text'
                            placeholder='username'
                            className='text-muted-foreground'
                            onChange={(e) => setUserSearch(e.target.value)}
                          />
                          <Button
                            disabled={isLoading || !selectedUsers?.length}
                            className='w-48 rounded-md'
                            onClick={() => {
                              setIsLoading(true);
                              transferTicket.mutate({
                                user_id: selectedUsers![0]!.id,
                                ticket_id: ticket.id,
                              });
                              setDialogOpen(null); // Close the dialog
                              setSelectedUsers(null);
                              router.refresh();
                            }}
                          >
                            {isLoading && (
                              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                            )}
                            Transfer Ticket
                          </Button>
                        </div>
                        <UsersList
                          users={usersWithoutTickets}
                          usersLoading={false}
                          userProfile={userProfile}
                          maxUsers={1}
                          userSearch={userSearch}
                          selectedUsers={selectedUsers}
                          setSelectedUsers={setSelectedUsers}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
