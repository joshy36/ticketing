'use client';

import { Input } from '@/components/ui/input';
import { UserProfile } from 'supabase';
import { trpc } from '../../_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MessageView from './MessageView';
import { Button } from '@/components/ui/button';
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

export default function TicketList({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const router = useRouter();
  const [currentChat, setCurrentChat] = useState('');
  const [message, setMessage] = useState('');
  const { data: chats, refetch: refetchChats } = trpc.getUserChats.useQuery({
    user_id: userProfile.id,
  });

  const sendChatMessage = trpc.sendChatMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error sending message:', error);
      } else if (data) {
        console.log('Message sent:', data);
      }
      // if (!data) {
      //   toast.error('Error creating venue', {
      //     description: error?.message,
      //   });
      //   console.error('Error creating venue:', error);
      //   setIsLoading(false);
      // } else {
      //   router.refresh();
      //   router.push(`/dashboard/venue/create/image/${data.id}`);
      // }
    },
  });

  const getRandomUserFromChat = (index: number) => {
    return chats![index]!.chat_members.find(
      (user) => user.user_id != userProfile.id,
    )?.user_profiles;
  };

  const sendMessage = async () => {
    sendChatMessage.mutate({
      chat_id: currentChat,
      content: message,
    });
  };

  return (
    <div className='mx-auto -mt-16 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='flex h-screen border-x'>
        <div className='border-r'>
          <h1 className='px-24 pb-8 pt-28 text-2xl font-semibold'>Messages</h1>
          <div className='flex justify-center '>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='w-11/12 '>
                  New Message
                  <SendHorizonal className='ml-2 h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          {chats?.map((chat, index) => {
            return (
              <button
                key={chat.id}
                className='flex w-full justify-center border-b py-4'
                onClick={() => {
                  setCurrentChat(chat.id);
                  router.push(`/messages/?chat=${chat.id}`);
                }}
              >
                {chat.chat_type === 'dm' ? (
                  <div className='flex flex-row items-center gap-2'>
                    <Avatar>
                      {getRandomUserFromChat(index)?.profile_image ? (
                        <AvatarImage
                          src={getRandomUserFromChat(index)?.profile_image!}
                          alt='pfp'
                        />
                      ) : (
                        <AvatarFallback></AvatarFallback>
                      )}
                    </Avatar>

                    <div>
                      <div className='flex'>
                        {getRandomUserFromChat(index)?.first_name && (
                          <p className='py-1 font-medium'>
                            {getRandomUserFromChat(index)?.first_name}
                          </p>
                        )}
                        {getRandomUserFromChat(index)?.last_name && (
                          <p className='ml-1 py-1 font-medium'>
                            {getRandomUserFromChat(index)?.last_name}
                          </p>
                        )}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {`@${getRandomUserFromChat(index)?.username}`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>Group Message</div>
                )}
              </button>
            );
          })}
          {chats?.length === 0 && <p>No messages</p>}
        </div>
        <div className='flex flex-auto flex-col pl-4'>
          <div className='flex h-full flex-col'>
            <MessageView userProfile={userProfile} currentChat={currentChat} />
          </div>
          <div className='flex flex-row gap-2'>
            <Input
              className='mb-4 w-full rounded-full'
              placeholder='Message...'
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button
              type='submit'
              disabled={message.length === 0}
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
