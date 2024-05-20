'use client';

import Link from 'next/link';
import { UserProfile } from 'supabase';
import { trpc } from '~/app/_trpc/client';
import ProfileCard from '~/components/ProfileCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { ScrollArea } from '~/components/ui/scroll-area';

export default function FriendsView({
  userProfile,
  friendCount,
}: {
  userProfile: UserProfile;
  friendCount: number;
}) {
  const { data: friends } = trpc.getTotalFriendsForUser.useQuery({
    username: userProfile.username!,
  });

  return (
    <Dialog>
      <DialogTrigger className='flex flex-row'>
        <p className='md:text-md pb-4 text-sm font-light text-muted-foreground'>{`@${userProfile?.username} ·`}</p>
        {friendCount === 1 ? (
          <p className='md:text-md ml-1 pb-4 text-sm font-semibold text-muted-foreground hover:underline'>{`${friendCount} friend`}</p>
        ) : (
          <p className='md:text-md ml-1 pb-4 text-sm font-semibold text-muted-foreground hover:underline'>{`${friendCount} friends`}</p>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friends</DialogTitle>
          <DialogDescription>
            {friends?.length === 0 && (
              <div className='flex justify-center pt-8'>
                <p>No friends yet!</p>
              </div>
            )}
            <ScrollArea className='h-[200px] w-full'>
              {friends?.map((friend) => {
                return (
                  <Link
                    href={`/${friend.profile.username}`}
                    key={friend.profile.id}
                    className='flex flex-row items-center justify-between border-b border-zinc-800 p-2'
                  >
                    <ProfileCard userProfile={friend.profile} />
                  </Link>
                );
              })}
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
