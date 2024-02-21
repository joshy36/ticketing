import { RouterOutputs } from 'api';
import { UserProfile } from 'supabase';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState } from 'react';
import { Check, SendHorizonal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import ProfileCard from '@/components/ProfileCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import GroupCard from './GroupCard';

export default function RenderChats({
  userProfile,
  chats,
  chatsLoading,
  router,
}: {
  userProfile: UserProfile;
  chats: RouterOutputs['getUserChats'];
  chatsLoading: boolean;

  router: AppRouterInstance;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[] | null>(
    null,
  );

  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();

  const createChat = trpc.createChat.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error(error);
        if (error.message === 'User is already in an organization') {
          toast.error('User already in organization', {
            description: 'Please try a different username',
          });
        } else {
          toast.error('Error', {
            description: error.message,
          });
        }
      } else if (data) {
        console.log(data);

        router.push(`/messages/?chat=${data}`);
        setDialogOpen(false);
        setSelectedUsers(null);
        setUserSearch('');
      }
      setIsLoading(false);
    },
  });

  const getRandomUserFromChat = (index: number) => {
    return chats![index]!.chat_members.find(
      (user) => user.user_id != userProfile.id,
    )?.user_profiles;
  };

  return (
    <div>
      <div className='flex flex-row items-center justify-between gap-8 px-4 pb-4 pt-12 lg:pt-20'>
        <h1 className='text-2xl font-semibold'>Messages</h1>
        <div className='flex justify-center'>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <SendHorizonal className='-m-1 h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Select users to start a new chat with.
                </DialogDescription>
              </DialogHeader>
              <div className='flex flex-col flex-wrap'>
                {selectedUsers?.map((user) => {
                  return (
                    <div
                      key={user.id}
                      className='mx-2 my-1 rounded-full border p-2'
                    >
                      <ProfileCard userProfile={user} />
                    </div>
                  );
                })}
              </div>
              <div className='flex w-full flex-row space-x-2 pt-4'>
                <Input
                  type='text'
                  placeholder='username'
                  className='text-muted-foreground'
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <Button
                  disabled={isLoading || !selectedUsers?.length}
                  className='w-48 rounded-md'
                  onClick={() => {
                    setIsLoading(true);
                    createChat.mutate({
                      usernames: selectedUsers?.map((user) => user.username!)!,
                    });
                  }}
                >
                  {isLoading && (
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Start Chat
                </Button>
              </div>
              <div>
                {usersLoading ? (
                  <div>Loading...</div>
                ) : (
                  <ScrollArea className='h-[200px] w-full'>
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
                              .includes(userSearch.toLowerCase())),
                      )
                      .slice(0, 10)
                      .map((user) => {
                        return (
                          <Button
                            key={user.id}
                            className='flex h-full w-full justify-between rounded-none border-b bg-black hover:bg-secondary'
                            onClick={() => {
                              // if user is not selected add them
                              if (
                                !selectedUsers?.find((u) => u.id === user.id)
                              ) {
                                if (selectedUsers?.length === 6) {
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
                                  selectedUsers?.filter(
                                    (u) => u.id !== user.id,
                                  ),
                                );
                              }
                            }}
                          >
                            <ProfileCard userProfile={user} />
                            {selectedUsers?.find((u) => u.id === user.id) && (
                              <Check className='text-white' />
                            )}
                          </Button>
                        );
                      })}
                  </ScrollArea>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {chats?.length === 0 && (
        <p className='pt-8 text-center'>No messages yet.</p>
      )}
      {chats?.map((chat, index) => {
        return (
          <button
            key={chat.id}
            className='flex w-full border-b px-4 py-4'
            onClick={() => {
              router.push(`/messages/?chat=${chat.id}`);
            }}
          >
            {chat.chat_type === 'dm' ? (
              <ProfileCard userProfile={getRandomUserFromChat(index)!} />
            ) : (
              <GroupCard
                userProfile={getRandomUserFromChat(index)!}
                chatMembers={chat.chat_members.map(
                  (member) => member.user_profiles!,
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
