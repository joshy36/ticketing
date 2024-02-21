'use client';

import { Message, UserProfile } from 'supabase';
import Messages from './Messages';
import { useEffect, useState } from 'react';
import { RouterOutputs, trpc } from '@/app/_trpc/client';
import { useRouter, useSearchParams } from 'next/navigation';
import createSupabaseBrowserClient from '@/utils/supabaseBrowser';
import RenderChats from './RenderChats';
import RenderMessages from './RenderMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import GroupCard from './GroupCard';

export default function StateManager({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChat = searchParams.get('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] =
    useState<RouterOutputs['getMessagesByChat']>(null);
  const supabase = createSupabaseBrowserClient();

  const { data: messagesInCurrentChat } = trpc.getMessagesByChat.useQuery({
    chat_id: currentChat,
  });

  const {
    data: chats,
    isLoading: chatsLoading,
    refetch,
  } = trpc.getUserChats.useQuery({
    user_id: userProfile.id,
  });

  const currentChatDetails = chats?.find((chat) => chat.id === currentChat);

  useEffect(() => {
    if (messagesInCurrentChat) {
      setMessages(messagesInCurrentChat);
    }
  }, [messagesInCurrentChat]);

  useEffect(() => {
    const channel = supabase
      .channel('chat-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          // filter: `chat_id=eq.${currentChat}`,
        },
        async (payload) => {
          const message = payload.new as Message;
          const { data: newMessage } = await supabase
            .from('chat_messages')
            .select(`*, user_profiles(*)`)
            .eq('id', message.id)
            .eq('chat_id', currentChat!)
            .limit(1)
            .single();

          setMessages((prevMessages) => [...prevMessages!, newMessage!]);
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
        },
        (payload) => {
          refetch();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, messages, setMessages]);

  const sendMessage = async () => {
    sendChatMessage.mutate({
      chat_id: currentChat!,
      content: message,
    });
    setMessage('');
  };

  const getRandomUserFromChat = (chatId: string | null) => {
    return chats
      ?.find((chat) => chat.id === chatId)
      ?.chat_members.find((user) => user.user_id != userProfile.id)
      ?.user_profiles!;
  };

  const sendChatMessage = trpc.sendChatMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        // console.error('Error sending message:', error);
      } else if (data) {
        // console.log('Message sent:', data);
      }
    },
  });

  return (
    <div>
      <div className='hidden lg:block'>
        <Messages
          userProfile={userProfile!}
          message={message}
          messages={messages}
          chats={chats!}
          chatsLoading={chatsLoading}
          currentChat={currentChat}
          router={router}
          sendMessage={sendMessage}
          setMessage={setMessage}
        />
      </div>
      <div className='lg:hidden'>
        {!currentChat ? (
          <RenderChats
            userProfile={userProfile}
            chats={chats}
            chatsLoading={chatsLoading}
            router={router}
          />
        ) : (
          <div className='flex max-h-screen w-full flex-col justify-between'>
            <div className='fixed top-16 z-40 w-full border-b bg-black py-2 text-center font-bold'>
              <div className='flex flex-row items-center justify-between px-4'>
                <Button
                  variant='ghost'
                  onClick={() => {
                    router.push(`/messages`);
                  }}
                >
                  <ChevronLeft className='-ml-1' />
                  Back
                </Button>
                {currentChatDetails?.chat_type === 'dm' ? (
                  <ProfileCard
                    userProfile={getRandomUserFromChat(currentChat)}
                  />
                ) : (
                  <GroupCard
                    userProfile={getRandomUserFromChat(currentChat)}
                    chatMembers={
                      currentChatDetails?.chat_members.map(
                        (member) => member.user_profiles!,
                      )!
                    }
                  />
                )}
                <Info />
              </div>
            </div>
            <div className='flex h-screen flex-col overflow-hidden pb-20 pt-16'>
              <RenderMessages userProfile={userProfile} messages={messages} />
            </div>
            <form
              className='fixed bottom-0 flex w-full flex-row gap-2 border-t bg-black/50 px-4 pt-4 backdrop-blur-md'
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                sendMessage();
              }}
            >
              <Input
                className='mb-4 w-full rounded-full'
                placeholder='Message...'
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                value={message}
              />
              <Button type='submit' disabled={message.length === 0}>
                Send
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
