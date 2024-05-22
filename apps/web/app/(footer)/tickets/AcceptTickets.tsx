'use client';

import { useState } from 'react';
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
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/ui/icons';
import { trpc } from '~/app/_trpc/client';
import { toast } from 'sonner';
import { RouterOutputs } from 'api';

export default function AcceptTickets({
  pendingPushRequsts,
  refetchPush,
  refetchTickets,
}: {
  pendingPushRequsts:
    | RouterOutputs['getPendingTicketTransferPushRequests']
    | undefined;
  refetchPush: () => void;
  refetchTickets: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const rejectTransfer = trpc.rejectTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        await refetchPush();
        await refetchTickets();
        toast.error(`Error rejecting transfer: ${error.message}`);
        console.error('Error rejecting transfer: ', error);
      } else {
        await refetchPush();
        await refetchTickets();
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
        await refetchTickets();
        toast.error(`Error accepting transfer: ${error.message}`);
        console.error('Error accepting transfer: ', error);
      } else {
        await refetchPush();
        await refetchTickets();
        toast.success('Ticket transfer request accepted!');
      }
      setIsLoading(false);
      setDialogOpen(null);
    },
  });

  return (
    <div>
      {pendingPushRequsts && pendingPushRequsts.length != 0 && (
        <div className='flex flex-col justify-center px-2 py-6'>
          <div className='pt-4'>
            <h1 className='text-xl font-bold'>Accept Tickets</h1>
            <p className='pb-4 text-sm font-light text-muted-foreground'>
              Here you can see pending ticket transfers from friends. You must
              accept or reject these tickets before the event begins.
            </p>
          </div>
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
      )}
    </div>
  );
}
