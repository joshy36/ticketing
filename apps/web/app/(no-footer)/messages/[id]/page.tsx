'use client';

import { MessagesContext } from '@/utils/messagesProvider';
import { useContext } from 'react';
import GroupCard from './GroupCard';
import { ChevronLeft, Info } from 'lucide-react';
import RenderMessages from './RenderMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ChatProfileCard from './ChatProfileCard';

export default function Home({ params }: { params: { id: string } }) {
  const { userProfile, chats, message, setMessage, sendMessage } =
    useContext(MessagesContext);

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
    <div className='max-w-screen flex max-h-screen w-full flex-col justify-between'>
      <div className='mt-16 flex w-full border-b py-2 text-center font-bold'>
        <div className='flex w-full flex-row items-center justify-between px-4'>
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
        className='flex w-full flex-row gap-2 border-t px-4 pt-4'
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
