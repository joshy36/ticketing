'use client';

import { UserProfile } from 'supabase';
import { Button } from '~/components/ui/button';
import { UserPlus } from 'lucide-react';
import { trpc } from '~/app/_trpc/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Icons } from '~/components/ui/icons';

export default function FriendRequest({
  currentUserId,
  otherUserProfile,
}: {
  currentUserId: string;
  otherUserProfile: UserProfile;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [relationshipStatus, setRelationshipStatus] = useState<
    'accepted' | 'rejected' | 'requested' | 'none' | 'isLoading'
  >('isLoading');

  const { data: relationship, isLoading: isRelationshipLoading } =
    trpc.getFriendshipStatus.useQuery({
      currentUserId: currentUserId,
      otherUser: otherUserProfile.username!,
    });

  useEffect(() => {
    if (relationship && !isRelationshipLoading) {
      setRelationshipStatus(relationship);

      console.log('relationship: ', relationship);
    }
  }, [relationship, isRelationshipLoading]);

  const requestFriend = trpc.requestFriend.useMutation({
    onSettled(data, error) {
      if (error) {
        toast.error('Error sending request');
      } else {
        toast.success('Request sent!');
        setRelationshipStatus('requested');
      }
      setIsLoading(false);
    },
  });

  return (
    <div>
      {relationshipStatus === 'isLoading' ? (
        <div></div>
      ) : (
        <Button
          variant='outline'
          onClick={() => {
            setIsLoading(true);
            requestFriend.mutate({ to: otherUserProfile.id! });
          }}
          disabled={isLoading || relationshipStatus !== 'none'}
          className='mt-4'
        >
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          {relationshipStatus === 'none' && (
            <div className='flex flex-row items-center gap-2'>
              Add friend <UserPlus className='h-4 w-4' />
            </div>
          )}
          {relationshipStatus === 'requested' && (
            <div className='flex flex-row items-center gap-2'>
              Request Pending
            </div>
          )}
          {relationshipStatus === 'rejected' && (
            <div className='flex flex-row items-center gap-2'>
              Request Rejected
            </div>
          )}
          {relationshipStatus === 'accepted' && (
            <div className='flex flex-row items-center gap-2'>Friends</div>
          )}
        </Button>
      )}
    </div>
  );
}
