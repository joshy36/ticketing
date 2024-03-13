'use client';

import { UserProfile } from 'supabase';
import { useContext, useState } from 'react';
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
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

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

  //   const createChat = trpc.createChat.useMutation({
  //     onSettled(data, error) {
  //       if (error) {
  //         console.error(error);
  //         if (error.message === 'User is already in an organization') {
  //           toast.error('User already in organization', {
  //             description: 'Please try a different username',
  //           });
  //         } else {
  //           toast.error('Error', {
  //             description: error.message,
  //           });
  //         }
  //       } else if (data) {
  //         console.log(data);

  //         router.push(`/messages/${data}`);
  //         setDialogOpen(false);
  //         setSelectedUsers(null);
  //         setUserSearch('');
  //       }
  //       setIsLoading(false);
  //     },
  //   });

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
    <View>
      {/* <View className="flex justify-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <SendHorizonal className="-m-1 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Select users to start a new chat with.
                </DialogDescription>
              </DialogHeader>
              <View className="flex flex-col flex-wrap">
                {selectedUsers?.map((user) => {
                  return (
                    <View
                      key={user.id}
                      className="mx-2 my-1 rounded-full border p-2"
                    >
                      <ProfileCard userProfile={user} />
                    </View>
                  );
                })}
              </View>
              <View className="flex w-full flex-row space-x-2 pt-4">
                <Input
                  type="text"
                  placeholder="username"
                  className="text-muted-foreground"
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <Button
                  disabled={isLoading || !selectedUsers?.length}
                  className="w-48 rounded-md"
                  onClick={() => {
                    setIsLoading(true);
                    createChat.mutate({
                      usernames: selectedUsers?.map((user) => user.username!)!,
                    });
                  }}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Start Chat
                </Button>
              </View>
              <View>
                {usersLoading ? (
                  <View>Loading...</View>
                ) : (
                  <ScrollArea className="h-[200px] w-full">
                    {users
                      ?.filter(
                        (user) =>
                          user?.id !== userProfile.id && // Exclude currently signed-in user
                          (user?.username
                            ?.toLowerCase()
                            .includes(userSearch.toLowerCase()) ||
                            user?.first_name
                              ?.toLowerCase()
                              .includes(userSearch.toLowerCase()) ||
                            user?.last_name
                              ?.toLowerCase()
                              .includes(userSearch.toLowerCase()) ||
                            `${user.first_name} ${user.last_name}`
                              .toLowerCase()
                              .includes(userSearch.toLowerCase()))
                      )
                      .slice(0, 10)
                      .map((user) => {
                        return (
                          <Button
                            key={user.id}
                            className="flex h-full w-full justify-between rounded-none border-b bg-black hover:bg-secondary"
                            onClick={() => {
                              // if user is not selected add them
                              if (
                                !selectedUsers?.find((u) => u.id === user.id)
                              ) {
                                if (selectedUsers?.length === 5) {
                                  toast.error('Maximum users reached', {
                                    description: 'Maximum of 6 users per chat',
                                  });
                                  return;
                                }
                                setSelectedUsers([
                                  ...(selectedUsers || []),
                                  user,
                                ]);
                              } else {
                                // if user is selected remove them
                                setSelectedUsers(
                                  selectedUsers?.filter((u) => u.id !== user.id)
                                );
                              }
                            }}
                          >
                            <ProfileCard userProfile={user} />
                            {selectedUsers?.find((u) => u.id === user.id) && (
                              <Check className="text-white" />
                            )}
                          </Button>
                        );
                      })}
                  </ScrollArea>
                )}
              </View>
            </DialogContent>
          </Dialog>
        </View> */}
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
    </View>
  );
}
