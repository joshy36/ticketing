'use client';

import ProfileCard from '~/components/ProfileCard';
import { Button } from '~/components/ui/button';
import { MessagesContext } from '~/providers/messagesProvider';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import OrgCard from '../OrgCard';

export default function Home({ params }: { params: { id: string } }) {
  const { userProfile, chats } = useContext(MessagesContext);

  const currentChatDetails = chats?.chats?.find(
    (chat) => chat.id === params.id,
  );

  const artist = currentChatDetails?.chat_members.find(
    (member) => member.artists,
  )?.artists;
  const venue = currentChatDetails?.chat_members.find(
    (member) => member.venues,
  )?.venues;

  return (
    <div className='relative flex h-[100dvh] w-full flex-col'>
      <div className='mt-16 flex w-full items-center border-b px-4 py-2 text-center font-bold'>
        <Button variant='ghost' asChild>
          <Link href={`/messages/${params.id}`}>
            <ChevronLeft />
          </Link>
        </Button>
        <div className='pl-4'>Chat Details</div>
        <div></div>
      </div>
      <div className='flex flex-col px-4 pt-4'>
        {currentChatDetails?.chat_type !== 'organization' && (
          <div>
            <div className='pb-2 text-2xl font-bold'>People</div>
            <div>
              {currentChatDetails?.chat_members.map((member) => (
                <Link
                  href={`/${member.user_profiles?.username}`}
                  key={member.user_id}
                >
                  {member.user_id != userProfile?.id && (
                    <div className='border-b py-4 pl-4 hover:bg-secondary'>
                      <ProfileCard userProfile={member.user_profiles!} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
        {currentChatDetails?.chat_type === 'organization' && (
          <div className='py-4 pl-4 hover:bg-secondary'>
            <Link
              href={
                artist
                  ? `/artist/${artist?.id}`
                  : venue
                    ? `/venue/${venue?.id}`
                    : '/'
              }
            >
              <OrgCard artist={artist} venue={venue} mostRecentMessage={null} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
