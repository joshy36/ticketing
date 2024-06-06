import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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

      <div className='flex max-w-[200px] flex-col justify-between'>
        <div className='flex'>
          <p className='font-medium text-white'>{userProfile?.first_name}</p>
          <p className='ml-1 truncate text-ellipsis font-medium text-white'>
            {userProfile?.last_name}
          </p>
        </div>
        <div className='justify-start truncate text-ellipsis text-left text-xs text-muted-foreground'>
          {`@${userProfile?.username}`}
        </div>
      </div>
    </div>
  );
}
