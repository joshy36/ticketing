import { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SupabaseContext } from '../../providers/supabaseProvider';
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
        <ScrollView>
          <View className="pb-24">
            <View className="flex flex-row justify-end pr-2">
              <TouchableOpacity
                className="bg-black border border-gray-800 py-3 rounded-full w-24 "
                onPress={() => signOut()}
              >
                <Text className="text-white text-center font-bold">
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-col gap-2">
              <View>
                {userProfile && (
                  <Image
                    className="h-20 w-20 rounded-full flex justify-center items-center"
                    source={{
                      uri: replaceLocalhostWithIP(userProfile).profile_image,
                    }}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                  />
                )}
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
                  <Text className="pb-4 text-sm font-light text-muted-foreground">
                    {`@${userProfile?.username}`} {' · '}
                  </Text>
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

            <View className="gap-8 pt-8">
              <View>
                <View className="flex flex-row items-center gap-2">
                  <Text className="text-white text-2xl font-bold">
                    Collectibles
                  </Text>
                </View>
                <View className="flex gap-8 pt-8">
                  {collectibles?.length === 0 ? (
                    <Text className="text-muted-foreground text-lg font-light">
                      Attend events to build a collection.
                    </Text>
                  ) : (
                    <View>
                      {collectibles?.map((collectible) => (
                        <View key={collectible.id}>
                          <View className="aspect-square w-full overflow-hidden rounded-tl-2xl rounded-tr-2xl">
                            {collectible.events?.image && (
                              <Image
                                source={{
                                  uri: replaceLocalhostWithIP(
                                    collectible.events
                                  ).image,
                                }}
                                alt="collectible Image"
                                className="h-full w-full object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75"
                              />
                            )}
                          </View>
                          <View className="rounded-bl-2xl rounded-br-2xl bg-zinc-900">
                            <Text className="py-4 pl-4 text-white">
                              {collectible.events?.name}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View>
                <View className="flex flex-row items-center gap-2">
                  <Text className="text-white text-2xl font-bold">
                    Community
                  </Text>
                </View>
                <View className="grid grid-cols-1 gap-8 pt-8">
                  {sbts?.length === 0 ? (
                    <Text className="text-muted-foreground text-lg font-light">
                      Attend events to build a collection.
                    </Text>
                  ) : (
                    <View>
                      {sbts?.map((sbt) => (
                        <View key={sbt.id}>
                          <View className="aspect-square w-full overflow-hidden rounded-tl-2xl rounded-tr-2xl">
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
                          <View className="rounded-bl-2xl rounded-br-2xl bg-zinc-900">
                            <Text className="py-4 pl-4 text-white">
                              {sbt.events?.name}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ProfilePage;
