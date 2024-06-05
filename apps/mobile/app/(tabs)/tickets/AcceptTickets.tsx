import { useState } from 'react';
import { XCircle } from 'lucide-react';
import ProfileCard from '@/app/components/ProfileCard';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '~/components/ui/dialog';
// import { Button } from '~/components/ui/button';
// import { Icons } from '~/components/ui/icons';
import { trpc } from '@/utils/trpc';
// import { toast } from 'sonner';
import { RouterOutputs } from 'api';
import { View, Text, TouchableOpacity } from 'react-native';

export default function AcceptTickets({
  pendingPushRequsts,
  refetchPush,
}: {
  pendingPushRequsts:
    | RouterOutputs['getPendingTicketTransferPushRequests']
    | undefined;
  refetchPush: () => Promise<any>;
}) {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const rejectTransfer = trpc.rejectTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        await refetchPush();
        // toast.error(`Error rejecting transfer: ${error.message}`);
        console.error('Error rejecting transfer: ', error);
      } else {
        await refetchPush();
        // toast.success('Ticket transfer request rejected!');
      }
      setIsLoading(false);
      setDialogOpen(null);
    },
  });

  const acceptTransfer = trpc.acceptTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      if (error) {
        await refetchPush();
        // toast.error(`Error accepting transfer: ${error.message}`);
        console.error('Error accepting transfer: ', error);
      } else {
        await refetchPush();
        // toast.success('Ticket transfer request accepted!');
      }
      setIsLoading(false);
      setDialogOpen(null);
    },
  });

  return (
    <View>
      {pendingPushRequsts && pendingPushRequsts.length != 0 && (
        <View className='flex flex-col justify-center border-b border-zinc-800 px-2 py-6'>
          <View className='pt-4'>
            <Text className='text-xl font-bold text-white'>Accept Tickets</Text>
            <Text className='pb-4 text-sm font-light text-muted-foreground'>
              Here you can see pending ticket transfers from friends. You must
              accept or reject these tickets before the event begins.
            </Text>
          </View>
          {pendingPushRequsts?.map((request, index) => (
            <View key={request.id} className='border-b px-2 py-2'>
              <Text className='font-bold text-white'>From:</Text>
              <View className='flex flex-row items-center justify-between py-2'>
                <ProfileCard userProfile={request.from_profile!} />
                <View className='flex items-center gap-8 font-medium'>
                  <View className='flex flex-col'>
                    <Text className='text-white'>
                      {pendingPushRequsts![index]?.tickets?.events?.name}
                    </Text>
                    <Text className='text-sm font-extralight text-muted-foreground'>
                      {pendingPushRequsts![index]?.tickets?.seat}
                    </Text>
                  </View>
                </View>
              </View>
              <View className='flex flex-row justify-end gap-2'>
                {/* <Dialog
                  open={dialogOpen === request.id} // Only open the dialog if its id matches with dialogOpen state
                  onOpenChange={(isOpen) => {
                    if (!isOpen) setDialogOpen(null); // Close the dialog
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex flex-row items-center gap-2"
                      onClick={() => setDialogOpen(request.id)}
                    >
                      <XCircle className="h-4 w-4" />
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

                    <View className="flex w-full flex-row justify-end space-x-2 pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setDialogOpen(null);
                        }}
                      >
                        No
                      </Button>
                      <Button
                        disabled={isLoading}
                        className=""
                        onClick={() => {
                          setIsLoading(true);
                          rejectTransfer.mutate({
                            ticket_id: request.ticket_id!,
                          });
                        }}
                      >
                        {isLoading && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Yes
                      </Button>
                    </View>
                  </DialogContent>
                </Dialog> */}
                <TouchableOpacity className='rounded-full border border-zinc-800 px-4 py-2'>
                  <Text className='text-white'>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='rounded-full bg-white px-4 py-2'
                  onPress={() => {
                    setIsLoading(true);
                    acceptTransfer.mutate({
                      ticket_id: request.ticket_id!,
                    });
                  }}
                >
                  <Text>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
