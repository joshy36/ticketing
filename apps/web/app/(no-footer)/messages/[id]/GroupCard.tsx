import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
          <Avatar className='z-40 opacity-100' key={member.id}>
            {userProfile?.profile_image ? (
              <AvatarImage src={member?.profile_image!} alt='pfp' />
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
        ))}
        {/*         // <Avatar className='z-40'>
        //   {userProfile?.profile_image ? (
        //     <AvatarImage src={otherMembers[0]?.profile_image!} alt='pfp' />
        //   ) : (
        //     <AvatarFallback></AvatarFallback>
        //   )}
        // </Avatar> */}
        {/* <div className='z-50 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-secondary text-xs font-medium text-white'>
          {chatMembers.length}
        </div> */}
      </div>
      <div className='ml-1 flex max-w-[300px] flex-col truncate text-ellipsis'>
        <p className='truncate text-ellipsis font-medium text-white'>
          {allMembersNames}
        </p>
        <p className='truncate text-ellipsis text-left text-sm font-light text-muted-foreground'>
          {mostRecentMessage}
        </p>
      </div>
    </div>
  );
}
