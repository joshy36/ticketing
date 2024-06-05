import { UserProfile } from 'supabase';
import { Image } from 'expo-image';
import {
  blurhash,
  replaceLocalhostWithIP,
  truncate,
} from '../../../utils/helpers';
import { View, Text } from 'react-native';

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
    <View className='flex flex-row items-center gap-10'>
      <View className='flex flex-row pl-4'>
        {otherMembers.map((member) => (
          <View className='z-40 -mx-4' key={member.id}>
            {userProfile?.profile_image ? (
              // <AvatarImage src={member?.profile_image!} alt='pfp' />
              <Image
                className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-black'
                source={{ uri: replaceLocalhostWithIP(member).profile_image }}
                placeholder={blurhash}
                contentFit='cover'
                transition={1000}
              />
            ) : (
              // <AvatarFallback></AvatarFallback>
              <View></View>
            )}
          </View>
        ))}
      </View>
      <View className='ml-1 flex max-w-[160px] flex-col'>
        <Text className='truncate text-ellipsis text-base font-medium text-white'>
          {truncate(allMembersNames, 20)}
        </Text>
        <Text className='truncate text-ellipsis text-left text-sm font-light text-muted-foreground'>
          {truncate(mostRecentMessage, 20)}
        </Text>
      </View>
    </View>
  );
}
