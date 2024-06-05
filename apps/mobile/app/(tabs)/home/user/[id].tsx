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
      { enabled: !!userProfile && !!otherUserProfile },
    );

  const { data: friendCount, refetch: refetchFriendCount } =
    trpc.getTotalFriendsCountForUser.useQuery(
      {
        username: otherUserProfile?.username!,
      },
      { enabled: !!otherUserProfile },
    );

  const { data: sbts, refetch: refetchSbts } = trpc.getSbtsForUser.useQuery(
    {
      user_id: otherUserProfile?.id!,
    },
    { enabled: !!otherUserProfile },
  );

  const { data: collectibles, refetch: retetchCollectibles } =
    trpc.getCollectiblesForUser.useQuery(
      {
        user_id: otherUserProfile?.id!,
      },
      { enabled: !!otherUserProfile },
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
    <View className='flex-1 bg-black px-4 pt-28'>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='white'
          />
        }
      >
        {otherUserProfileLoading ? (
          <Text className='text-white'>Loading...</Text>
        ) : (
          <View className='pb-24'>
            <View className='flex flex-col gap-2'>
              <View>
                {otherUserProfile && (
                  <Image
                    className='flex h-20 w-20 items-center justify-center rounded-full'
                    source={{
                      uri: replaceLocalhostWithIP(otherUserProfile)
                        .profile_image,
                    }}
                    placeholder={blurhash}
                    contentFit='cover'
                    transition={1000}
                  />
                )}
              </View>
              <View className='pb-6'>
                <View className='flex flex-row'>
                  {otherUserProfile?.first_name && (
                    <Text className='text-2xl font-bold text-white'>{`${otherUserProfile.first_name} `}</Text>
                  )}
                  {otherUserProfile?.last_name && (
                    <Text className='text-2xl font-bold text-white'>{`${otherUserProfile.last_name}`}</Text>
                  )}
                </View>
                <Text className='flex flex-row py-2'>
                  <Text className='pb-4 text-sm font-light text-muted-foreground'>{`@${otherUserProfile?.username} ·`}</Text>
                  {friendCount === 1 ? (
                    <Text className='ml-2 pb-4 text-sm font-semibold text-muted-foreground hover:underline'>{`${friendCount} friend`}</Text>
                  ) : (
                    <Text className='ml-2 pb-4 text-sm font-semibold text-muted-foreground hover:underline'>{`${friendCount} friends`}</Text>
                  )}
                </Text>
                <View className='space-y-6'>
                  <Text className='text-base font-light text-white'>
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

            <View className='gap-8 pt-8'>
              <View>
                <View className='flex flex-row items-center gap-2'>
                  <Text className='text-2xl font-bold text-white'>
                    Collectibles
                  </Text>
                </View>
                <View className='grid grid-cols-1 gap-8 pt-8'>
                  {collectibles?.length === 0 ? (
                    <Text className='text-lg font-light text-muted-foreground'>
                      Attend events to build a collection.
                    </Text>
                  ) : (
                    <View>
                      {collectibles?.map((collectible) => (
                        <View key={collectible.id}>
                          <View className='aspect-square w-full overflow-hidden rounded-tl-2xl rounded-tr-2xl'>
                            {collectible.events?.image && (
                              <Image
                                source={{
                                  uri: replaceLocalhostWithIP(
                                    collectible.events,
                                  ).image,
                                }}
                                alt='collectible Image'
                                className='h-full w-full object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75'
                              />
                            )}
                          </View>
                          <View className='rounded-bl-2xl rounded-br-2xl bg-zinc-900'>
                            <Text className='py-4 pl-4 text-white'>
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
                <View className='flex flex-row items-center gap-2'>
                  <Text className='text-2xl font-bold text-white'>
                    Community
                  </Text>
                </View>
                <View className='grid grid-cols-1 gap-8 pt-8'>
                  {sbts?.length === 0 ? (
                    <Text className='text-lg font-light text-muted-foreground'>
                      Attend events to build a collection.
                    </Text>
                  ) : (
                    <View>
                      {sbts?.map((sbt) => (
                        <View key={sbt.id}>
                          <View className='aspect-square w-full overflow-hidden rounded-tl-2xl rounded-tr-2xl'>
                            {sbt.events?.image && (
                              <Image
                                source={{
                                  uri: replaceLocalhostWithIP(sbt.events).image,
                                }}
                                alt='sbt Image'
                                className='h-full w-full object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75'
                              />
                            )}
                          </View>
                          <View className='rounded-bl-2xl rounded-br-2xl bg-zinc-900'>
                            <Text className='py-4 pl-4 text-white'>
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
        )}
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
