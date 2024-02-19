import { RouterOutputs } from 'api';
import { UserProfile } from 'supabase';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
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
  const [user, setUser] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

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
                  Select a user to start a new chat with.
                  <div className='flex w-full max-w-sm items-center space-x-2 pt-4'>
                    <Input
                      type='text'
                      placeholder='username'
                      className='text-muted-foreground'
                      onChange={(e) => setUser(e.target.value)}
                    />
                    <Button
                      disabled={isLoading}
                      className='w-32 rounded-md'
                      onClick={() => {
                        setIsLoading(true);
                        createChat.mutate({
                          usernames: [user],
                        });
                      }}
                    >
                      {isLoading && (
                        <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Chat
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
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
              <div>Group Message</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
