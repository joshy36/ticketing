import { View, Text } from 'react-native';
import { UserProfile } from 'supabase';
import { Image } from 'expo-image';
import {
  blurhash,
  replaceLocalhostWithIP,
  truncate,
} from '../../utils/helpers';

export default function ProfileCard({
  userProfile,
  imageSize = 12,
}: {
  userProfile: UserProfile;
  imageSize?: number;
}) {
  return (
    <View className="flex flex-row items-center gap-2">
      <View>
        {userProfile?.profile_image ? (
          // <AvatarImage src={userProfile?.profile_image!} alt='pfp' />
          <Image
            className={`h-${imageSize} w-${imageSize} rounded-full flex justify-center items-center`}
            source={{ uri: replaceLocalhostWithIP(userProfile).profile_image }}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
        ) : (
          // <AvatarFallback></AvatarFallback>
          <View></View>
        )}
      </View>

      <View className="flex max-w-[225px] flex-col justify-between">
        <View className="flex">
          <Text className="font-medium text-base text-white">
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
        </View>
        <View>
          <Text className="text-sm font-light text-muted-foreground">
            {`@${userProfile?.username}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
