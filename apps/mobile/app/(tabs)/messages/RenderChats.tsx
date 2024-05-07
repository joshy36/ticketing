'use client';

import { UserProfile } from 'supabase';
import { Check, SendHorizonal } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Icons } from '@/components/ui/icons';
import { trpc } from '../../../utils/trpc';
// import { toast } from 'sonner';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useRouter } from 'next/navigation';
// import ProfileCard from './ProfileCard';
// import { MessagesContext } from 'providers';
import { MessagesContext } from './messagesProvider';
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
import { FriendRequestContext } from './friendRequestsProvider';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useCallback, useContext, useState } from 'react';

export default function RenderChats({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[] | null>(
    null
  );
  //   const router = useRouter();
  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();

  const {
    chats,
    mostRecentMessageByChat,
    numberOfUnreadMessagesPerChat,
    setNumberOfUnreadMessagesPerChat,
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
        new Date(a.mostRecentMessageTimestamp).getTime()
    );

  const getRandomUserFromChat = (index: number) => {
    return chatsWithTimestamps![index]!.chat_members.find(
      (user) => user.user_id != userProfile.id
    )?.user_profiles;
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="white"
        />
      }
    >
      <Link href="/messages/requests" asChild>
        <TouchableOpacity className="flex flex-row w-full items-center justify-between border-b border-zinc-800 px-4 py-6 font-medium hover:bg-zinc-800/50 focus:bg-secondary">
          <View className="flex flex-row gap-4 items-center">
            <Feather name="users" color="white" size={20} />
            <Text className="text-white font-bold text-lg">
              Friend Requests
            </Text>
          </View>
          {friendRequests && friendRequests?.length > 0 && (
            <View className="flex pr-2">
              <View className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-xs font-light">
                <Text className="text-white text-xs">
                  {friendRequests?.length}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Link>
      {chats?.chats?.length === 0 && (
        <p className="pt-8 text-center">No messages yet.</p>
      )}
      {chatsWithTimestamps?.map((chat, index) => {
        return (
          <Link href={`/messages/${chat.id}`} key={chat.id} asChild>
            <TouchableOpacity
              className={`flex flex-row items-center justify-between w-full gap-2 border-b border-zinc-800 px-4 py-4`}
              onPress={() => {
                setNumberOfUnreadMessagesPerChat((prevState) => ({
                  ...prevState,
                  [chat.id]: { unread: 0 },
                }));
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
                      (member) => member.user_profiles!
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
                      chat?.chat_members.find((member) => member.venues)?.venues
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
                  <View className="flex pr-2">
                    <View className="h-3 w-3 rounded-full bg-blue-700"></View>
                  </View>
                )}
            </TouchableOpacity>
          </Link>
        );
      })}
    </ScrollView>
  );
}
