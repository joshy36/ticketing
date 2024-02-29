'use client';

import { Input } from '@/components/ui/input';
import { UserProfile } from 'supabase';
import { RouterOutputs } from '../../../_trpc/client';
import { Dispatch, SetStateAction, useContext } from 'react';
import { Button } from '@/components/ui/button';
import RenderMessages from './RenderMessages';
import RenderChats from './RenderChats';
import ProfileCard from '@/components/ProfileCard';
import { Info } from 'lucide-react';
import GroupCard from './GroupCard';
import { useRouter } from 'next/navigation';
import { MessagesContext } from '@/utils/messagesProvider';

export default function LargeScreenMessages({
  userProfile,
  message,
  currentChat,
  sendMessage,
  setMessage,
}: {
  userProfile: UserProfile;
  message: string;
  currentChat: string | null;
  sendMessage: () => void;
  setMessage: Dispatch<SetStateAction<string>>;
}) {
  const { chats } = useContext(MessagesContext);
  const currentChatDetails = chats?.chats?.find(
    (chat) => chat.id === currentChat,
  );

  const getRandomUserFromChat = () => {
    return currentChatDetails?.chat_members.find(
      (user) => user.user_id != userProfile.id,
    )?.user_profiles!;
  };

  return (
    <div className='mx-auto -mt-16 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
      ></meta>
      <div className='flex h-screen border-x'>
        <div className='border-r'>
          <RenderChats userProfile={userProfile} currentChat={currentChat} />
        </div>
        <div className='flex w-full justify-center'>
          {currentChat ? (
            <div className='flex max-h-screen w-full flex-col justify-between pt-20'>
              <div className='flex items-center justify-between border-b px-4 py-2'>
                {currentChatDetails?.chat_type === 'dm' ? (
                  <ProfileCard userProfile={getRandomUserFromChat()} />
                ) : (
                  <div>
                    {currentChatDetails ? (
                      <GroupCard
                        userProfile={userProfile}
                        chatMembers={currentChatDetails?.chat_members.map(
                          (member) => member.user_profiles!,
                        )}
                        mostRecentMessage={null}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                )}
                <Info />
              </div>

              <div className='flex h-screen flex-col overflow-hidden'>
                <RenderMessages userProfile={userProfile} />
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
          ) : (
            <div className='flex items-center justify-center'>
              <div className='flex flex-col'>
                <h1 className='text-4xl font-bold'>Select a message</h1>
                <p className='font-light text-muted-foreground'>
                  Choose an existing conversation to view or start a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
