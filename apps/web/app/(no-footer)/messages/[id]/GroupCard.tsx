import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { UserProfile } from 'supabase';

export default function GroupCard({
  userProfile,
  chatMembers,
  mostRecentMessage,
}: {
  userProfile: UserProfile;
  chatMembers: UserProfile[];
  mostRecentMessage: string | null | undefined;
}) {
  // Exclude the user with the same id as userProfile
  const otherMembers = chatMembers.filter(
    (member) => member.id !== userProfile.id,
  );

  const allMembersNames = otherMembers
    .map((member) => `${member.first_name} ${member.last_name}`)
    .join(', ');

  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-end -space-x-6 rtl:space-x-reverse'>
        {otherMembers.map((member) => (
          <Avatar className='z-40 border border-black' key={member.id}>
            {userProfile?.profile_image ? (
              <AvatarImage src={member?.profile_image!} alt='pfp' />
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
        ))}
      </div>
      <div className='ml-1 flex max-w-[180px] flex-col'>
        <p className='truncate text-ellipsis font-medium text-foreground'>
          {allMembersNames}
        </p>
        <p className='truncate text-ellipsis text-left text-sm font-light text-muted-foreground'>
          {mostRecentMessage}
        </p>
      </div>
    </div>
  );
}
