'use client';

import { UserProfile } from 'supabase';
import LargeScreenMessages from './LargeScreenMessages';
import { useContext, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import RenderChats from './RenderChats';
import RenderMessages from './RenderMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import GroupCard from './GroupCard';
import { useRouter } from 'next/navigation';
import { MessagesContext } from '@/utils/messagesProvider';

export default function StateManager({
  userProfile,
  id,
}: {
  userProfile: UserProfile;
  id: string;
}) {
  const currentChat = id;
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { chats } = useContext(MessagesContext);

  const currentChatDetails = chats?.chats?.find(
    (chat) => chat.id === currentChat,
  );

  const sendMessage = async () => {
    sendChatMessage.mutate({
      chat_id: currentChat!,
      content: message,
    });
    setMessage('');
  };

  const sendChatMessage = trpc.sendChatMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        // console.error('Error sending message:', error);
      } else if (data) {
        // console.log('Message sent:', data);
      }
    },
  });

  const getRandomUserFromChat = (chatId: string | null) => {
    return chats?.chats
      ?.find((chat) => chat.id === chatId)
      ?.chat_members.find((user) => user.user_id != userProfile.id)
      ?.user_profiles!;
  };

  return (
    <div>
      <div className='hidden lg:block'>
        <LargeScreenMessages
          userProfile={userProfile!}
          message={message}
          currentChat={currentChat}
          sendMessage={sendMessage}
          setMessage={setMessage}
        />
      </div>
      <div className='lg:hidden'>
        {!currentChat ? (
          <RenderChats userProfile={userProfile} currentChat={currentChat} />
        ) : (
          <div className='flex max-h-screen w-full flex-col justify-between'>
            <div className='fixed top-16 z-40 w-full border-b bg-black py-2 text-center font-bold'>
              <div className='flex flex-row items-center justify-between px-4'>
                <Button
                  variant='ghost'
                  onClick={() => {
                    router.push(`/messages`);
                  }}
                >
                  <ChevronLeft />
                </Button>
                {currentChatDetails?.chat_type === 'dm' ? (
                  <ProfileCard
                    userProfile={getRandomUserFromChat(currentChat)}
                  />
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
            </div>
            <div className='flex h-screen flex-col overflow-hidden pb-20 pt-16'>
              <RenderMessages userProfile={userProfile} />
            </div>
            <form
              className='fixed bottom-0 flex w-full flex-row gap-2 border-t bg-black/50 px-4 pt-4 backdrop-blur-md'
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
        )}
      </div>
    </div>
  );
}
