'use client';

import { MessagesContext } from '~/providers/messagesProvider';
import { useContext, useState } from 'react';
import GroupCard from './GroupCard';
import { ChevronLeft, Info } from 'lucide-react';
import RenderMessages from './RenderMessages';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import ChatProfileCard from './ChatProfileCard';
import { trpc } from '~/app/_trpc/client';
import Link from 'next/link';
import OrgCard from './OrgCard';
import RenderMessagesOrg from './RenderMessagesOrg';

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
          <Button className='lg:hidden' variant='ghost' asChild>
            <Link href={`/messages`}>
              <ChevronLeft />
            </Link>
          </Button>
          {currentChatDetails?.chat_type === 'dm' && (
            <ChatProfileCard
              userProfile={getRandomUserFromChat()}
              mostRecentMessage={null}
            />
          )}
          {currentChatDetails?.chat_type === 'group' && (
            <GroupCard
              userProfile={userProfile!}
              chatMembers={currentChatDetails?.chat_members.map(
                (member) => member.user_profiles!,
              )}
              mostRecentMessage={null}
            />
          )}
          {currentChatDetails?.chat_type === 'organization' && (
            <OrgCard
              artist={
                currentChatDetails?.chat_members.find(
                  (member) => member.artists,
                )?.artists
              }
              venue={
                currentChatDetails?.chat_members.find((member) => member.venues)
                  ?.venues
              }
              mostRecentMessage={null}
            />
          )}
          <Button asChild variant='ghost'>
            <Link href={`/messages/${params.id}/info`}>
              <Info />
            </Link>
          </Button>
        </div>
      </div>
      <div className='flex h-screen flex-col overflow-hidden'>
        {currentChatDetails?.chat_type !== 'organization' && (
          <RenderMessages userProfile={userProfile!} />
        )}
        {currentChatDetails?.chat_type === 'organization' && (
          <RenderMessagesOrg
            artist={
              currentChatDetails?.chat_members.find((member) => member.artists)
                ?.artists
            }
            venue={
              currentChatDetails?.chat_members.find((member) => member.venues)
                ?.venues
            }
          />
        )}
      </div>
      {currentChatDetails?.chat_type !== 'organization' && (
        <form
          className='absolute bottom-0 flex w-full flex-row gap-2 bg-black/50 px-4 pt-4 backdrop-blur-md'
          onSubmit={(e) => {
            e.preventDefault(); // Prevent page reload
            sendMessage();
          }}
        >
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
          ></meta>
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
      )}
    </div>
  );
}
