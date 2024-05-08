'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { UserProfile } from 'supabase';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { XCircle } from 'lucide-react';
import ProfileCard from '~/components/ProfileCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Icons } from '~/components/ui/icons';
import { trpc } from '~/app/_trpc/client';
import { toast } from 'sonner';

export function Id({ userProfile }: { userProfile: UserProfile }) {
  const [qrCode, showQRCode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: userSalt, isLoading: saltLoading } = trpc.getUserSalt.useQuery({
    user_id: userProfile?.id!,
  });
  const { data: pendingPushRequsts, refetch: refetchPush } =
    trpc.getPendingTicketTransferPushRequests.useQuery();

  const rejectTransfer = trpc.rejectTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        await refetchPush();
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
        await refetchPush();
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
              Hide QR
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
        <div className='pt-4'>
          <h1 className='text-xl font-bold'>Accept Tickets</h1>
          <p className='pb-4 text-sm font-light text-muted-foreground'>
            Here you can see pending ticket transfers from friends. You must
            accept or reject these tickets before the event begins.
          </p>
        </div>
        {pendingPushRequsts?.length === 0 && (
          <div>No tickets to accept right now.</div>
        )}
        {pendingPushRequsts?.map((request, index) => (
          <div key={request.id} className='border-b px-2 py-2'>
            <p className='font-bold'>From:</p>
            <div className='flex flex-row items-center justify-between py-2'>
              <ProfileCard userProfile={request.from_profile!} />
              <div className='flex items-center gap-8 font-medium'>
                <div className='flex flex-col'>
                  <p>{pendingPushRequsts![index]?.tickets?.events?.name}</p>
                  <p className='text-sm font-extralight text-muted-foreground'>
                    {pendingPushRequsts![index]?.tickets?.seat}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <Dialog
                open={dialogOpen === request.id} // Only open the dialog if its id matches with dialogOpen state
                onOpenChange={(isOpen) => {
                  if (!isOpen) setDialogOpen(null); // Close the dialog
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='destructive'
                    className='flex flex-row items-center gap-2'
                    onClick={() => setDialogOpen(request.id)}
                  >
                    <XCircle className='h-4 w-4' />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Ticket Transfer</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reject this ticket?
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
                        rejectTransfer.mutate({
                          ticket_id: request.ticket_id!,
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
              <Button
                variant='outline'
                onClick={() => {
                  setIsLoading(true);
                  acceptTransfer.mutate({
                    ticket_id: request.ticket_id!,
                  });
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
