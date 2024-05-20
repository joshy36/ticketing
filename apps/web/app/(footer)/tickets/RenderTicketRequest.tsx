import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import Link from 'next/link';
import { AlertCircle, X } from 'lucide-react';
import { Icons } from '~/components/ui/icons';
import { trpc } from '~/app/_trpc/client';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

export default function RenderTicketRequest({
  pending,
  isLoading,
  setIsLoading,
  refetchTickets,
  refetchUsers,
}: {
  pending: any;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  refetchTickets: () => void;
  refetchUsers: () => void;
}) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState<string | null>(null);
  const cancelRequestTransfer = trpc.cancelTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      await refetchTickets();
      await refetchUsers();
      if (error) {
        toast.error(`Error canceling transfer: ${error.message}`);
        console.error('Error canceling transfer: ', error);
      } else {
        toast.success('Ticket transfer request canceled!');
      }
      setIsLoading(false);
      setCancelDialogOpen(null);
    },
  });

  if (pending.status === 'accepted') {
    return (
      <div className='flex flex-col gap-2'>
        <Link
          href={`/${pending.to_profile.username}`}
          className='flex flex-col gap-2'
        >
          <div className='flex flex-row items-center gap-2'>
            <Avatar>
              {pending.to_profile?.profile_image ? (
                <AvatarImage
                  src={pending.to_profile?.profile_image!}
                  alt='pfp'
                />
              ) : (
                <AvatarFallback></AvatarFallback>
              )}
            </Avatar>

            <div className='flex max-w-[200px] flex-col justify-between'>
              <div className='flex'>
                <p className='font-medium text-white'>
                  {pending.to_profile?.first_name}
                </p>
                <p className='ml-1 truncate text-ellipsis font-medium text-white'>
                  {pending.to_profile?.last_name}
                </p>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-green-500'></span>
                <p className='text-muted-foreground'>Accepted</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  } else if (pending.status === 'rejected') {
    return (
      <div className='flex flex-row items-center gap-2 font-light text-red-600'>
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
          <div className='flex flex-row items-center gap-2'>
            <Avatar>
              {pending.to_profile?.profile_image ? (
                <AvatarImage
                  src={pending.to_profile?.profile_image!}
                  alt='pfp'
                />
              ) : (
                <AvatarFallback></AvatarFallback>
              )}
            </Avatar>

            <div className='flex max-w-[200px] flex-col justify-between'>
              <div className='flex'>
                <p className='font-medium text-white'>
                  {pending.to_profile?.first_name}
                </p>
                <p className='ml-1 truncate text-ellipsis font-medium text-white'>
                  {pending.to_profile?.last_name}
                </p>
              </div>
              <div className='flex flex-row items-center gap-2 '>
                <span className='h-2 w-2 rounded-full bg-yellow-500'></span>
                <p className='text-sm font-light text-muted-foreground'>
                  Pending
                </p>
              </div>
            </div>
          </div>
        </Link>

        <div className='flex'>
          <Dialog
            open={cancelDialogOpen === pending.ticket_id} // Only open the dialog if its id matches with dialogOpen state
            onOpenChange={(isOpen) => {
              if (!isOpen) setCancelDialogOpen(null); // Close the dialog
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant='outline'
                className='flex w-full flex-row items-center gap-2 text-yellow-500'
                onClick={() => setCancelDialogOpen(pending.ticket_id)}
              >
                <X className='h-4 w-4' />
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
                    setCancelDialogOpen(null);
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
}
