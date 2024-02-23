import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from 'supabase';

export default function ChatProfileCard({
  userProfile,
  mostRecentMessage,
}: {
  userProfile: UserProfile;
  mostRecentMessage: string | null | undefined;
}) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Avatar>
        {userProfile?.profile_image ? (
          <AvatarImage src={userProfile?.profile_image!} alt='pfp' />
        ) : (
          <AvatarFallback></AvatarFallback>
        )}
      </Avatar>

      <div className='flex max-w-[300px] flex-col justify-between'>
        <div className='flex items-center'>
          <p className='truncate text-ellipsis font-medium text-white'>
            {userProfile?.first_name} {userProfile?.last_name}
          </p>
        </div>
        <div>
          <p className='truncate text-ellipsis text-left text-sm font-light text-muted-foreground'>
            {mostRecentMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
