'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Bell, ChevronRight, Trash } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { dateToString } from '@/utils/helpers';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MessageCenter() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch,
  } = trpc.getMessagesForUser.useQuery();

  const readMessage = trpc.setMessageRead.useMutation({
    onSettled() {
      refetch();
    },
  });

  const deleteMessage = trpc.deleteMessage.useMutation({
    onSettled() {
      refetch();
    },
  });

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <div className='relative'>
          <Button
            variant='outline'
            size='icon'
            className='bg-black/25 '
            onClick={() => setSheetOpen(true)}
          >
            <Bell className='h-4 w-4' />
          </Button>
          <span className='absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-blue-700'></span>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
        </SheetHeader>
        {messages?.filter((message) => message.status !== 'deleted').length ==
        0 ? (
          <div className='pt-8'>No messages, check back later.</div>
        ) : (
          <div className='pt-4'>
            {messages
              ?.filter((message) => message.status !== 'deleted')
              ?.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              )
              ?.map((message) => (
                <div
                  key={message.id}
                  className='flex flex-row items-center gap-2'
                >
                  <AlertDialog>
                    <AlertDialogTrigger
                      onClick={() =>
                        readMessage.mutate({ message_id: message.id })
                      }
                      className='my-2 flex w-full flex-row items-center justify-between rounded-md border bg-zinc-900/60 p-4 pt-4 hover:border-muted-foreground hover:bg-zinc-800/60 hover:backdrop-blur-lg'
                    >
                      <div className='flex flex-col gap-2'>
                        <div className='text-left text-white'>
                          {message.message.length < 32
                            ? message.message
                            : `${message.message.slice(0, 32)}...`}
                        </div>
                        <div className='text-left text-xs font-light text-muted-foreground'>
                          {dateToString(message.created_at)}
                        </div>
                      </div>
                      <div className='flex'>
                        {message.status === 'unread' && (
                          <span className='h-3 w-3 rounded-full bg-blue-700'></span>
                        )}
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Message</AlertDialogTitle>
                        <AlertDialogDescription>
                          {message.message}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className='flex flex-row items-center justify-between gap-2'>
                        <div>
                          <AlertDialogCancel
                            onClick={() => {
                              deleteMessage.mutate({ message_id: message.id });
                            }}
                            className='gap-2 border-red-700 text-red-700 hover:border-red-700/40 hover:bg-red-700/40'
                          >
                            <Trash className='h-4 w-4' />
                            Delete
                          </AlertDialogCancel>
                        </div>

                        <div className='flex gap-2'>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              setSheetOpen(false);
                              router.push(`/event/${message.event_id}`);
                            }}
                            className='items-center gap-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700'
                          >
                            View Event
                            <ChevronRight className='h-4 w-4' />
                          </AlertDialogAction>
                        </div>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='ghost' className=''>
                        <Trash className='h-4 w-4 hover:text-red-700' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      Place content for the popover here.
                    </PopoverContent>
                  </Popover> */}
                </div>
              ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
