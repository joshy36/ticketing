import { useContext } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SupabaseContext } from '../../utils/supabaseProvider';
import { trpc } from '../../utils/trpc';
import { blurhash } from '../../utils/helpers';

const ProfilePage = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { signOut, user } = supabaseContext;

  const { data: profile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery({
      id: user?.id!,
    });

  return (
    <View className="flex-1 bg-black px-4 pt-24">
      {profileLoading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        <ScrollView>
          <View>
            <Pressable
              className="bg-white py-3 rounded-xl flex w-24 justify-end"
              onPress={() => signOut()}
            >
              <Text className="text-black text-center font-bold">Sign Out</Text>
            </Pressable>
            <View className="justify-center items-center">
              <Image
                className="h-40 w-40 rounded-full flex justify-center items-center"
                source={{ uri: profile?.profile_image! }}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
              />
            </View>

            <Text className="text-white text-2xl font-bold py-4 text-center">
              {`@${profile?.username}`}
            </Text>
            <View className="space-y-6">
              {profile?.first_name ? (
                <Text className="text-white text-base text-accent-foreground">{`${profile.first_name} `}</Text>
              ) : (
                <Text></Text>
              )}
              {profile?.last_name ? (
                <Text className="text-white text-base text-accent-foreground">{`${profile.last_name}`}</Text>
              ) : (
                <Text></Text>
              )}
            </View>
            <View className="space-y-6">
              <Text className="text-white text-base text-accent-foreground">
                {profile?.bio}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ProfilePage;
