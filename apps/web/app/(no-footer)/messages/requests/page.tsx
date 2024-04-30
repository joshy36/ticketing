'use client';

import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { trpc } from '~/app/_trpc/client';
import ProfileCard from '~/components/ProfileCard';
import { useContext } from 'react';
import { toast } from 'sonner';
import { FriendRequestContext } from '~/providers/friendRequestsProvider';

export default function Requests() {
  const { friendRequests, setFriendRequests, friendRequestsLoading } =
    useContext(FriendRequestContext);

  const rejectRequest = trpc.rejectFriendRequest.useMutation({
    onMutate(data) {
      const newRequests = friendRequests?.filter(
        (request) => request.from.id !== data.from,
      );
      setFriendRequests(newRequests!);
      toast.success('Request rejected!');
    },
  });

  const acceptRequest = trpc.acceptFriendRequest.useMutation({
    onMutate(data) {
      const newRequests = friendRequests?.filter(
        (request) => request.from.id !== data.from,
      );
      setFriendRequests(newRequests!);
      toast.success('Request accepted!');
    },
  });

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
      {friendRequests?.length === 0 && !friendRequestsLoading ? (
        <div className='flex h-64 flex-col items-center justify-center'>
          <p className='text-muted-foreground'>No new friend requests.</p>
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
                  <Button
                    variant='destructive'
                    onClick={() => {
                      rejectRequest.mutate({ from: request.from.id });
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      acceptRequest.mutate({ from: request.from.id });
                    }}
                  >
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
