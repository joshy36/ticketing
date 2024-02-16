'use client';

import { Input } from '@/components/ui/input';
import { UserProfile } from 'supabase';
import { RouterOutputs } from '../../_trpc/client';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import RenderMessages from './RenderMessages';
import RenderChats from './RenderChats';

export default function TicketList({
  userProfile,
  message,
  messages,
  chats,
  chatsLoading,
  router,
  sendMessage,
  setMessage,
  setCurrentChat,
}: {
  userProfile: UserProfile;
  message: string;
  messages: RouterOutputs['getMessagesByChat'];
  chats: RouterOutputs['getUserChats'];
  chatsLoading: boolean;
  router: AppRouterInstance;
  sendMessage: () => void;
  setMessage: Dispatch<SetStateAction<string>>;
  setCurrentChat: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className='mx-auto -mt-16 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='flex h-screen border-x'>
        <div className='border-r'>
          <RenderChats
            userProfile={userProfile}
            chats={chats}
            chatsLoading={chatsLoading}
            router={router}
            setCurrentChat={setCurrentChat}
          />
        </div>
        <div className='flex max-h-screen w-full flex-col justify-between pt-20'>
          <div className='border-b py-2 text-center font-bold'>Name</div>
          <div className='flex h-screen flex-col overflow-hidden'>
            <RenderMessages userProfile={userProfile} messages={messages} />
          </div>
          <form
            className='flex flex-row gap-2 border-t px-4 pt-4'
            onSubmit={(e) => {
              e.preventDefault(); // Prevent page reload
              sendMessage();
            }}
          >
            <Input
              className='mb-4 w-full rounded-full'
              placeholder='Message...'
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              value={message}
            />
            <Button type='submit' disabled={message.length === 0}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
