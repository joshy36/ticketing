import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from 'supabase';

export default function GroupCard({
  userProfile,
  chatMembers,
}: {
  userProfile: UserProfile;
  chatMembers: UserProfile[];
}) {
  // Exclude the user with the same id as userProfile
  const otherMembers = chatMembers.filter(
    (member) => member.id !== userProfile.id,
  );

  const allMembersNames = otherMembers
    .map((member) => `${member.first_name} ${member.last_name}`)
    .join(', ');

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex items-end -space-x-4 rtl:space-x-reverse'>
        <Avatar className='z-40'>
          {userProfile?.profile_image ? (
            <AvatarImage src={otherMembers[0]?.profile_image!} alt='pfp' />
          ) : (
            <AvatarFallback></AvatarFallback>
          )}
        </Avatar>
        <div className='z-50 flex h-6 w-6 items-center justify-center rounded-full border border-black bg-secondary text-xs font-medium text-white'>
          {chatMembers.length}
        </div>
      </div>

      <div className='flex flex-col justify-between'>
        <div className='flex'>
          <p className='ml-1 truncate font-medium text-white'>
            {allMembersNames}
          </p>
        </div>
      </div>
    </div>
  );
}
