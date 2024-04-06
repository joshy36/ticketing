'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Ticket, UserProfile } from 'supabase';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RouterOutputs } from 'api';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import ProfileCard from '@/components/ProfileCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import UsersList from '@/components/UsersList';
import { Icons } from '@/components/ui/icons';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
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

  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();
  const { data: userSalt, isLoading: saltLoading } = trpc.getUserSalt.useQuery({
    user_id: userProfile?.id!,
  });

  const transferTicket = trpc.transferTicketDatabase.useMutation({
    onSettled(data, error) {
      if (error) {
        toast.error(`Error transferring ticket: ${error.message}`);
        console.error('Error transferring ticket: ', error);
        setIsLoading(false);
      } else {
        toast.success('Ticket transferred!');
        setIsLoading(false);
      }
    },
  });

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
            <Button
              onClick={() => showQRCode(!qrCode)}
              className='mb-4 w-full rounded-md'
            >
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
            className='w-full rounded-md'
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
                    <p className='font-extralight text-muted-foreground'>
                      {ticket.seat}
                    </p>
                  </div>
                </div>

                {ticket.owner_id ? (
                  <Link
                    href={`/${tickets.ownerProfiles[index]?.username}`}
                    className='flex flex-row gap-2'
                  >
                    {ticket.owner_id && (
                      <div className='flex flex-row items-center gap-2 font-light text-green-500'>
                        <CheckCircle className='h-4 w-4' />
                      </div>
                    )}
                    <ProfileCard userProfile={tickets.ownerProfiles[index]!} />
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
                        variant='outline'
                        onClick={() => setDialogOpen(ticket.id)}
                        className='text-yellow-500'
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
                        users={users}
                        usersLoading={usersLoading}
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
  );
}
