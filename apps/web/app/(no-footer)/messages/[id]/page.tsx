'use client';

import { MessagesContext } from '@/utils/messagesProvider';
import { useContext, useState } from 'react';
import GroupCard from './GroupCard';
import { ChevronLeft, Info } from 'lucide-react';
import RenderMessages from './RenderMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ChatProfileCard from './ChatProfileCard';
import { trpc } from '@/app/_trpc/client';

export default function Home({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    sendChatMessage.mutate({
      chat_id: params.id,
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

  const { userProfile, chats } = useContext(MessagesContext);

  const router = useRouter();
  const currentChatDetails = chats?.chats?.find(
    (chat) => chat.id === params.id,
  );

  const getRandomUserFromChat = () => {
    return currentChatDetails?.chat_members.find(
      (user) => user.user_id != userProfile?.id,
    )?.user_profiles!;
  };

  return (
    <div className='max-w-screen relative flex h-[100dvh] w-full flex-col justify-between'>
      <div className='mt-16 flex w-full border-b py-2 text-center font-bold'>
        <div className='relative top-0 flex w-full flex-row items-center justify-between px-4'>
          <Button
            className='-px-2 lg:hidden'
            variant='ghost'
            onClick={() => {
              router.push(`/messages`);
            }}
          >
            <ChevronLeft />
          </Button>
          {currentChatDetails?.chat_type === 'dm' ? (
            <ChatProfileCard
              userProfile={getRandomUserFromChat()}
              mostRecentMessage={null}
            />
          ) : (
            <div>
              {currentChatDetails ? (
                <GroupCard
                  userProfile={userProfile!}
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
      <div className='flex h-screen flex-col overflow-hidden'>
        <RenderMessages userProfile={userProfile!} />
      </div>
      <form
        className='absolute bottom-0 flex w-full flex-row gap-2 border-t bg-black/50 px-4 pt-4 backdrop-blur-md'
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
  );
}
