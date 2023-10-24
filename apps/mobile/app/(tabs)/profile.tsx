import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../utils/trpc';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Profile = () => {
  const { data: profile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery({
      id: '699d0320-769b-4999-a232-3f7517c8ff2a',
    });

  return (
    <View className="flex-1 items-center justify-center bg-black">
      {profileLoading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        <View>
          <Image
            style={{ borderRadius: 16 }}
            className="h-64 w-64"
            source={{ uri: profile?.profile_image! }}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
          <Text className="py-12 text-lg text-white">{profile?.username}</Text>
        </View>
      )}
    </View>
  );
};

export default Profile;
