'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { dateToString } from '@/utils/helpers';
import { useState } from 'react';

export default function MessageCenter() {
  const [messageView, setMessageView] = useState(false);
  const { data: messages, isLoading: messagesLoading } =
    trpc.getMessagesForUser.useQuery();

  messages?.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className='relative'>
          <Button variant='outline' size='icon' className='bg-black/25'>
            <Bell className='h-4 w-4' />
          </Button>
          <span className='absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-blue-700'></span>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
          <SheetDescription>
            This is where you recieve messages from artists and venues about
            upcoming events and promotions.
          </SheetDescription>
        </SheetHeader>
        {messages?.length == 0 ? (
          <div className='pt-4'>No messages yet, check back later.</div>
        ) : (
          <div className='pt-4'>
            {messages
              ?.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              )
              ?.map((message) => (
                <button
                  key={message.id}
                  className='my-2 flex w-full flex-row items-center justify-between rounded-md border bg-zinc-900/60 p-4 pt-4 hover:border-muted-foreground hover:bg-zinc-800/60'
                >
                  <div className='flex flex-col gap-2'>
                    <div className='text-left text-white'>
                      {message.message}
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
                </button>
              ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
