'use client';

import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { trpc } from '~/app/_trpc/client';
import ProfileCard from '~/components/ProfileCard';

export default function Requests() {
  const { data: friendRequests } =
    trpc.getPendingFriendRequestsForUser.useQuery();
  // const friendRequests = [];
  return (
    <div className='flex w-full flex-col'>
      <div className='mt-16 flex w-full items-center border-b py-2 font-bold'>
        <Button className='lg:hidden' variant='ghost' asChild>
          <Link href={`/messages`}>
            <ChevronLeft />
          </Link>
        </Button>
        <p className='pl-4'>Friend Requests</p>
      </div>
      {friendRequests?.length === 0 ? (
        <div className='flex h-64 flex-col items-center justify-center'>
          <p className='text-muted-foreground'>No new friend requests</p>
        </div>
      ) : (
        <div>
          {friendRequests?.map((request) => {
            return (
              <div
                key={request.id}
                className='flex flex-row justify-between gap-12 border-b p-4'
              >
                <ProfileCard userProfile={request.from!} />
                <div className='flex gap-2'>
                  <Button variant='destructive' className='rounded-md'>
                    Reject
                  </Button>
                  <Button variant='outline' className='rounded-md'>
                    Accept
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
