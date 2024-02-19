import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from 'supabase';

export default function ProfileCard({
  userProfile,
}: {
  userProfile: UserProfile;
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

      <div className='flex flex-col justify-between'>
        <div className='flex'>
          {userProfile?.first_name && (
            <p className='font-medium'>{userProfile?.first_name}</p>
          )}
          {userProfile?.last_name && (
            <p className='ml-1 font-medium'>{userProfile?.last_name}</p>
          )}
        </div>
        <div className='text-xs text-muted-foreground'>
          {`@${userProfile?.username}`}
        </div>
      </div>
    </div>
  );
}
