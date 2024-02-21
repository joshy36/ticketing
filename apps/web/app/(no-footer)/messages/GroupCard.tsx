import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from 'supabase';

export default function GroupCard({
  userProfile,
  chatMembers,
}: {
  userProfile: UserProfile;
  chatMembers: UserProfile[];
}) {
  console.log('userProfile', userProfile);
  console.log('chatMembers', chatMembers);
  // Exclude the user with the same id as userProfile
  const otherMembers = chatMembers.filter(
    (member) => member.id !== userProfile.id,
  );
  console.log('otherMembers', otherMembers);

  const allMembersNames = otherMembers
    .map((member) => `${member.first_name} ${member.last_name}`)
    .join(', ');

  const truncatedNames = allMembersNames.substring(0, 25) + '...';

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex items-center -space-x-4 rtl:space-x-reverse'>
        <Avatar className='z-40'>
          {userProfile?.profile_image ? (
            <AvatarImage src={otherMembers[0]?.profile_image!} alt='pfp' />
          ) : (
            <AvatarFallback></AvatarFallback>
          )}
        </Avatar>
        <div className='z-50 flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-secondary text-xs font-medium text-white'>
          +{chatMembers.length - 1}
        </div>
      </div>

      <div className='flex flex-col justify-between'>
        <div className='flex'>
          <p className='ml-1 font-medium text-white'>{truncatedNames}</p>
        </div>
      </div>
    </div>
  );
}
