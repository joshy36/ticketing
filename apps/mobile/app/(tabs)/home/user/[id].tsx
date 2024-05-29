import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../../utils/trpc';
import { blurhash, replaceLocalhostWithIP } from '../../../../utils/helpers';
import Separator from '../../../components/Separator';
import { useLocalSearchParams } from 'expo-router';
import FriendRequest from './FriendRequest';
import { useCallback, useContext, useState } from 'react';
import { SupabaseContext } from '../../../../providers/supabaseProvider';

const ProfilePage = () => {
  const { id } = useLocalSearchParams();
  const { userProfile } = useContext(SupabaseContext);

  const [refreshing, setRefreshing] = useState(false);

  const { data: otherUserProfile, isLoading: otherUserProfileLoading } =
    trpc.getUserProfile.useQuery({
      id: id! as string,
    });

  const { data: relationship, refetch: refetchRelationship } =
    trpc.getFriendshipStatus.useQuery(
      {
        currentUserId: userProfile?.id,
        otherUser: otherUserProfile?.username!,
      },
      { enabled: !!userProfile && !!otherUserProfile }
    );

  const { data: friendCount, refetch: refetchFriendCount } =
    trpc.getTotalFriendsCountForUser.useQuery(
      {
        username: otherUserProfile?.username!,
      },
      { enabled: !!otherUserProfile }
    );

  const { data: sbts, refetch: refetchSbts } = trpc.getSbtsForUser.useQuery(
    {
      user_id: otherUserProfile?.id!,
    },
    { enabled: !!otherUserProfile }
  );

  const { data: collectibles, refetch: retetchCollectibles } =
    trpc.getCollectiblesForUser.useQuery(
      {
        user_id: otherUserProfile?.id!,
      },
      { enabled: !!otherUserProfile }
    );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchFriendCount();
    await refetchRelationship();
    await refetchSbts();
    await retetchCollectibles();
    setRefreshing(false);
  }, []);

  return (
    <View className="flex-1 bg-black px-4 pt-28">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
      >
        {otherUserProfileLoading ? (
          <Text className="text-white">Loading...</Text>
        ) : (
          <View className="pb-24">
            <View className="flex flex-col gap-2">
              <View>
                {otherUserProfile && (
                  <Image
                    className="h-20 w-20 rounded-full flex justify-center items-center"
                    source={{
                      uri: replaceLocalhostWithIP(otherUserProfile)
                        .profile_image,
                    }}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                  />
                )}
              </View>
              <View className="pb-6">
                <View className="flex flex-row">
                  {otherUserProfile?.first_name && (
                    <Text className="text-white text-2xl font-bold">{`${otherUserProfile.first_name} `}</Text>
                  )}
                  {otherUserProfile?.last_name && (
                    <Text className="text-white text-2xl font-bold">{`${otherUserProfile.last_name}`}</Text>
                  )}
                </View>
                <Text className="flex flex-row py-2">
                  <Text className="pb-4 text-sm font-light text-muted-foreground">{`@${otherUserProfile?.username} ·`}</Text>
                  {friendCount === 1 ? (
                    <Text className="ml-2 pb-4 text-sm font-semibold text-muted-foreground hover:underline">{`${friendCount} friend`}</Text>
                  ) : (
                    <Text className="ml-2 pb-4 text-sm font-semibold text-muted-foreground hover:underline">{`${friendCount} friends`}</Text>
                  )}
                </Text>
                <View className="space-y-6">
                  <Text className="text-white font-light text-base">
                    {otherUserProfile?.bio}
                  </Text>
                </View>
                {userProfile && (
                  <FriendRequest
                    userProfile={otherUserProfile!}
                    relationship={relationship!}
                    refetchRelationship={refetchRelationship}
                  />
                )}
              </View>
              <Separator />
            </View>

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
                    <View className="grid grid-cols-1 gap-4">
                      {collectibles?.map((sbt) => (
                        <View
                          key={sbt.id}
                          className="flex flex-row gap-2 items-center"
                        >
                          {sbt.events?.image && (
                            <Image
                              source={{
                                uri: replaceLocalhostWithIP(sbt.events).image,
                              }}
                              alt="sbt Image"
                              className="h-12 w-12 object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75"
                            />
                          )}
                          <Text className="mt-4 text-lg font-light text-white">
                            {sbt.events?.name}
                          </Text>
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
                    <View className="grid grid-cols-1 gap-4">
                      {sbts?.map((sbt) => (
                        <View
                          key={sbt.id}
                          className="flex flex-row gap-2 items-center"
                        >
                          {sbt.events?.image && (
                            <Image
                              source={{
                                uri: replaceLocalhostWithIP(sbt.events).image,
                              }}
                              alt="sbt Image"
                              className="h-12 w-12 object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75"
                            />
                          )}
                          <Text className="mt-4 text-lg font-light text-white">
                            {sbt.events?.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
