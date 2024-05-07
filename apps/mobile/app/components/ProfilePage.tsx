import { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SupabaseContext } from '../../utils/supabaseProvider';
import { trpc } from '../../utils/trpc';
import { blurhash, replaceLocalhostWithIP } from '../../utils/helpers';
import Separator from './Separator';

const ProfilePage = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { signOut, userProfile, userProfileLoading } = supabaseContext;

  const { data: friendCount } = trpc.getTotalFriendsCountForUser.useQuery(
    {
      username: userProfile?.username!,
    },
    { enabled: !!userProfile }
  );

  const { data: sbts } = trpc.getSbtsForUser.useQuery(
    {
      user_id: userProfile?.id!,
    },
    { enabled: !!userProfile }
  );

  const { data: collectibles } = trpc.getCollectiblesForUser.useQuery(
    {
      user_id: userProfile?.id!,
    },
    { enabled: !!userProfile }
  );

  return (
    <View className="flex-1 bg-black px-4 pt-12">
      {userProfileLoading ? (
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
            <View>
              <Image
                className="h-20 w-20 rounded-full flex justify-center items-center"
                source={{
                  uri: replaceLocalhostWithIP(userProfile).profile_image,
                }}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
              />
            </View>
            <View className="pb-6">
              <View className="flex flex-row">
                {userProfile?.first_name && (
                  <Text className="text-white text-2xl font-bold">{`${userProfile.first_name} `}</Text>
                )}
                {userProfile?.last_name && (
                  <Text className="text-white text-2xl font-bold">{`${userProfile.last_name}`}</Text>
                )}
              </View>
              <Text className="flex flex-row py-2">
                <Text className="pb-4 text-sm font-light text-muted-foreground">{`@${userProfile?.username} ·`}</Text>
                {friendCount === 1 ? (
                  <Text className="ml-2 pb-4 text-sm font-semibold text-muted-foreground hover:underline">{`${friendCount} friend`}</Text>
                ) : (
                  <Text className="ml-2 pb-4 text-sm font-semibold text-muted-foreground hover:underline">{`${friendCount} friends`}</Text>
                )}
              </Text>
              <View className="space-y-6">
                <Text className="text-white font-light text-base">
                  {userProfile?.bio}
                </Text>
              </View>
            </View>
            <Separator />
          </View>
          <ScrollView>
            <View className="flex flex-row items-center justify-center gap-2 pt-4">
              <Text className="text-center text-white text-2xl font-bold">
                Social Wallet
              </Text>
            </View>
            <View className="grid grid-cols-1 gap-8 px-4 pt-8">
              <View>
                <View className="flex flex-row items-center justify-center gap-2">
                  <Text className="text-center text-white text-2xl underline underline-offset-8">
                    Collectibles
                  </Text>
                </View>
                <View className="grid grid-cols-1 gap-8 px-4 pt-8">
                  {collectibles?.length === 0 ? (
                    <Text className="text-center text-white text-xl font-extralight">
                      Attend events to build a collection!
                    </Text>
                  ) : (
                    <View className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {collectibles?.map((sbt) => (
                        <View key={sbt.id}>
                          <View className="xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background">
                            {sbt.events?.image && (
                              <Image
                                source={{
                                  uri: replaceLocalhostWithIP(sbt.events).image,
                                }}
                                alt="sbt Image"
                                className="h-full w-full object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75"
                              />
                            )}
                          </View>
                          <h1 className="mt-4 text-lg text-accent-foreground">
                            {sbt.events?.name}
                          </h1>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View>
                <View className="flex flex-row items-center justify-center gap-2">
                  <Text className="text-center text-white text-2xl underline underline-offset-8">
                    Community
                  </Text>
                </View>
                <View className="grid grid-cols-1 gap-8 px-4 pt-8">
                  {sbts?.length === 0 ? (
                    <Text className="text-center text-white text-xl font-extralight">
                      Attend events to build a collection!
                    </Text>
                  ) : (
                    <View className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {sbts?.map((sbt) => (
                        <View key={sbt.id}>
                          <View className="xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background">
                            {sbt.events?.image && (
                              <Image
                                source={{
                                  uri: replaceLocalhostWithIP(sbt.events).image,
                                }}
                                alt="sbt Image"
                                className="h-full w-full object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75"
                              />
                            )}
                          </View>
                          <Text className="mt-4 text-lg text-accent-foreground">
                            {sbt.events?.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ProfilePage;
