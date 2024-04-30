'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Ticket, UserProfile } from 'supabase';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { RouterOutputs } from 'api';
import {
  AlertCircle,
  CheckCircle,
  CircleEllipsis,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import ProfileCard from '~/components/ProfileCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import UsersListSingle from '~/components/UsersListSingle';
import { Icons } from '~/components/ui/icons';
import { useRouter } from 'next/navigation';
import { trpc } from '~/app/_trpc/client';
import { toast } from 'sonner';

export function Id({
  userProfile,
  tickets,
}: {
  userProfile: UserProfile;
  tickets: RouterOutputs['getTicketsForUser'];
}) {
  const [qrCode, showQRCode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[] | null>(
    null,
  );
  const [userSearch, setUserSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const { data: users, isLoading: usersLoading } =
    trpc.getTotalFriendsForUser.useQuery({ username: userProfile.username! });
  const { data: userSalt, isLoading: saltLoading } = trpc.getUserSalt.useQuery({
    user_id: userProfile?.id!,
  });

  const requestTransfer = trpc.requestTransferTicketPush.useMutation({
    onSettled(data, error) {
      if (error) {
        toast.error(`Error requesting transfer: ${error.message}`);
        console.error('Error requesting transfer: ', error);
      } else {
        toast.success('Ticket transfer request sent!');
      }
      setIsLoading(false);
      setDialogOpen(null); // Close the dialog
      setSelectedUsers(null);
      router.refresh();
    },
  });

  const cancelRequestTransfer = trpc.cancelTicketTransferPush.useMutation({
    onSettled(data, error) {
      if (error) {
        toast.error(`Error canceling transfer: ${error.message}`);
        console.error('Error canceling transfer: ', error);
      } else {
        toast.success('Ticket transfer request canceled!');
      }
      setIsLoading(false);
      setDialogOpen(null);
      router.refresh();
    },
  });

  const renderTicketRequest = (pending: any) => {
    if (pending.status === 'accepted') {
      return (
        <Link
          href={`/${pending.to_profile.username}`}
          className='flex flex-col gap-2'
        >
          <ProfileCard userProfile={pending.to_profile} />
          <div className='flex flex-row items-center gap-2 font-light text-green-500'>
            <p className='text-sm'>Accepted</p>
            <CheckCircle className='h-4 w-4' />
          </div>
        </Link>
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
            <div className='flex flex-row items-center gap-2'>
              <p className='text-sm '>Pending</p>
              <CircleEllipsis className='h-4 w-4' />
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
    <div className='flex flex-col items-center justify-center pt-8'>
      <div className='flex w-72 flex-col items-center justify-center rounded-3xl border p-6'>
        <Avatar className='h-48 w-48'>
          {userProfile?.profile_image ? (
            <AvatarImage src={userProfile?.profile_image} alt='pfp' />
          ) : (
            <AvatarFallback></AvatarFallback>
          )}
        </Avatar>
        <Separator className='my-4' />
        {userSalt && qrCode && (
          <div className='flex flex-col items-center justify-center'>
            <Button onClick={() => showQRCode(!qrCode)} className='mb-4 w-full'>
              Hide Qr
            </Button>
            <QRCode
              value={userSalt.salt!}
              bgColor='#000000'
              fgColor='#FFFFFF'
            />
          </div>
        )}
        {!qrCode && (
          <Button
            onClick={() => showQRCode(!qrCode)}
            variant='secondary'
            className='w-full'
          >
            Show QR
          </Button>
        )}
      </div>

      <div className='flex max-w-[600px] flex-col justify-center px-2 py-6'>
        {tickets.tickets?.filter((ticket) => ticket.owner_id !== userProfile.id)
          .length! > 0 && (
          <div>
            <h1 className='text-xl font-bold'>Transferable Tickets</h1>
            <p className='pb-4 text-sm font-light text-muted-foreground'>
              You must transfer these tickets to their respective owners before
              the event begins for them to be allowed entry. This will allow us
              to verify that the person entering the event is the rightful owner
              of the ticket.
            </p>
          </div>
        )}
        {tickets.tickets
          ?.filter((ticket) => ticket.owner_id !== userProfile.id)
          ?.map((ticket: Ticket, index: number) => (
            <div key={ticket.id}>
              <div className='flex flex-row items-center justify-between border-b px-2 py-2'>
                <div className='flex items-center gap-8 font-medium'>
                  <div className='flex flex-col'>
                    <p>{tickets.tickets![index]?.events?.name}</p>
                    <p className='text-sm font-extralight text-muted-foreground'>
                      {ticket.seat}
                    </p>
                  </div>
                </div>

                {tickets.pushRequestTickets?.find(
                  (ticketFind) => ticketFind.ticket_id === ticket.id,
                ) ? (
                  renderTicketRequest(
                    tickets.pushRequestTickets?.find(
                      (ticketFind) => ticketFind.ticket_id === ticket.id,
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
                        onClick={() => setDialogOpen(ticket.id)}
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
                        <DialogTitle>Transfer Ticket</DialogTitle>
                        <DialogDescription>
                          Select a user to transfer the ticket to. You must be
                          friends with someone to send them a ticket. You can
                          find people using the search bar to send them a friend
                          request.
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
                          placeholder='Search'
                          className='rounded-full text-muted-foreground'
                          onChange={(e) => setUserSearch(e.target.value)}
                        />
                        <Button
                          disabled={isLoading || !selectedUsers?.length}
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
                          Request Ticket Transfer
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
            </div>
          ))}
      </div>
    </div>
  );
}
