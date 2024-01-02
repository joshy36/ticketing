import { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SupabaseContext } from '../../utils/supabaseProvider';
import { trpc } from '../../utils/trpc';
import { blurhash } from '../../utils/helpers';
import Separator from './Separator';

const ProfilePage = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { signOut, user } = supabaseContext;

  const { data: profile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery({
      id: user?.id!,
    });

  return (
    <View className="flex-1 bg-black px-4 pt-12">
      {profileLoading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        <View>
          <View className="flex flex-row justify-end pr-2">
            <TouchableOpacity
              className="bg-black border border-gray-800 py-3 rounded-full w-24 "
              onPress={() => signOut()}
            >
              <Text className="text-white text-center font-bold">Sign Out</Text>
            </TouchableOpacity>
          </View>

          <View className="flex flex-col gap-2">
            <View className="justify-center">
              <Image
                className="h-20 w-20 rounded-2xl flex justify-center items-center"
                source={{ uri: profile?.profile_image! }}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
              />
            </View>
            <View className="pb-6">
              <View className="flex flex-row">
                {profile?.first_name && (
                  <Text className="text-white text-2xl font-bold">{`${profile.first_name} `}</Text>
                )}
                {profile?.last_name && (
                  <Text className="text-white text-2xl font-bold">{`${profile.last_name}`}</Text>
                )}
              </View>
              <Text className="text-muted-foreground py-2">
                {`@${profile?.username}`}
              </Text>
              <View className="space-y-6">
                <Text className="text-white text-base text-accent-foreground">
                  {profile?.bio}
                </Text>
              </View>
            </View>
            <Separator />
          </View>
          <ScrollView>
            <Text className="text-white text-5xl pt-20">
              SBTS and Collectibles
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ProfilePage;
