import { View, Text } from 'react-native';
import { trpc } from '../../utils/trpc';

const Profile = () => {
  const { data: profile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery({
      id: '699d0320-769b-4999-a232-3f7517c8ff2a',
    });

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white">Profile Page</Text>
      {profileLoading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        <Text className="py-12 text-lg text-white">{profile.username}</Text>
      )}
    </View>
  );
};

export default Profile;
