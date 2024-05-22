'use client';

import { UserProfile } from 'supabase';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

export default function AvatarView({
  userProfile,
}: {
  userProfile: UserProfile | null;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Avatar className='h-32 w-32'>
          {userProfile?.profile_image ? (
            <AvatarImage src={userProfile?.profile_image} alt='pfp' />
          ) : (
            <AvatarFallback></AvatarFallback>
          )}
        </Avatar>
      </DialogTrigger>
      <DialogContent className='flex items-center justify-center'>
        <Avatar className='h-80 w-80'>
          {userProfile?.profile_image ? (
            <AvatarImage src={userProfile?.profile_image} alt='pfp' />
          ) : (
            <AvatarFallback></AvatarFallback>
          )}
        </Avatar>
      </DialogContent>
    </Dialog>
  );
}
