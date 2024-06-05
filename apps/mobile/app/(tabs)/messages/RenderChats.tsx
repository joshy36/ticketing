import { UserProfile } from 'supabase';
import { MessagesContext } from '../../../providers/messagesProvider';
import ChatProfileCard from './ChatProfileCard';
import OrgCard from './OrgCard';
import GroupCard from './GroupCard';
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import { FriendRequestContext } from '../../../providers/friendRequestsProvider';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useCallback, useContext, useState } from 'react';

export default function RenderChats({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const {
    chats,
    mostRecentMessageByChat,
    numberOfUnreadMessagesPerChat,
    unreadMessages,
    setNumberOfUnreadMessagesPerChat,
    setUnreadMessages,
  } = useContext(MessagesContext);
  const { friendRequests, refetchFriendRequests } =
    useContext(FriendRequestContext);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchFriendRequests().then(() => {
      setRefreshing(false);
    });
  }, []);

  const chatsWithTimestamps = chats?.chats
    ?.map((chat) => ({
      ...chat,
      mostRecentMessageTimestamp:
        mostRecentMessageByChat?.[chat.id]?.created_at!,
    }))
    .sort(
      (a, b) =>
        new Date(b.mostRecentMessageTimestamp).getTime() -
        new Date(a.mostRecentMessageTimestamp).getTime(),
    );

  const getRandomUserFromChat = (index: number) => {
    return chatsWithTimestamps![index]!.chat_members.find(
      (user) => user.user_id != userProfile.id,
    )?.user_profiles;
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor='white'
        />
      }
    >
      <Link href='/messages/requests' asChild>
        <TouchableOpacity className='flex w-full flex-row items-center justify-between border-b border-zinc-800 px-4 py-6 font-medium hover:bg-zinc-800/50 focus:bg-secondary'>
          <View className='flex flex-row items-center gap-4'>
            <Feather name='users' color='white' size={20} />
            <Text className='text-lg font-bold text-white'>
              Friend Requests
            </Text>
          </View>
          {friendRequests && friendRequests?.length > 0 && (
            <View className='flex pr-2'>
              <View className='flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-xs font-light'>
                <Text className='text-xs text-white'>
                  {friendRequests?.length}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Link>
      {chats?.chats?.length === 0 && (
        <p className='pt-8 text-center'>No messages yet.</p>
      )}
      <View className='pb-24'>
        {chatsWithTimestamps?.map((chat, index) => {
          return (
            <Link href={`/messages/${chat.id}`} key={chat.id} asChild>
              <TouchableOpacity
                className={`flex w-full flex-row items-center justify-between gap-2 border-b border-zinc-800 px-4 py-4`}
                onPress={() => {
                  console.log(
                    'unred2: ',
                    numberOfUnreadMessagesPerChat![chat.id]?.unread,
                  );
                  console.log('unred: ', unreadMessages);
                  setUnreadMessages(0);
                  setNumberOfUnreadMessagesPerChat((prevState) => ({
                    ...prevState,
                    [chat.id]: { unread: 0 },
                  }));

                  console.log('unred3: ', unreadMessages);

                  //   router.push(`/messages/${chat.id}`);
                }}
              >
                <View>
                  {chat?.chat_type === 'dm' && (
                    <ChatProfileCard
                      userProfile={getRandomUserFromChat(index)!}
                      mostRecentMessage={
                        mostRecentMessageByChat
                          ? mostRecentMessageByChat[chat.id]?.message
                          : null
                      }
                    />
                  )}
                  {chat?.chat_type === 'group' && (
                    <GroupCard
                      userProfile={userProfile}
                      chatMembers={chat?.chat_members.map(
                        (member) => member.user_profiles!,
                      )}
                      mostRecentMessage={
                        mostRecentMessageByChat
                          ? mostRecentMessageByChat[chat.id]?.message
                          : null
                      }
                    />
                  )}
                  {chat.chat_type === 'organization' && (
                    <OrgCard
                      artist={
                        chat?.chat_members.find((member) => member.artists)
                          ?.artists
                      }
                      venue={
                        chat?.chat_members.find((member) => member.venues)
                          ?.venues
                      }
                      mostRecentMessage={
                        mostRecentMessageByChat
                          ? mostRecentMessageByChat[chat.id]?.message
                          : null
                      }
                    />
                  )}
                </View>
                {numberOfUnreadMessagesPerChat &&
                  numberOfUnreadMessagesPerChat[chat.id] &&
                  numberOfUnreadMessagesPerChat[chat.id]?.unread! > 0 && (
                    <View className='flex pr-2'>
                      <View className='h-3 w-3 rounded-full bg-blue-700'></View>
                    </View>
                  )}
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}
