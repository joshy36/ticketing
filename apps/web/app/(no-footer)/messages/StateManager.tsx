'use client';

import { Message, UserProfile } from 'supabase';
import Messages from './Messages';
import { useEffect, useState } from 'react';
import { RouterOutputs, trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/utils/supabaseBrowser';
import RenderChats from './RenderChats';
import RenderMessages from './RenderMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function StateManager({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const router = useRouter();
  const [currentChat, setCurrentChat] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] =
    useState<RouterOutputs['getMessagesByChat']>(null);
  const supabase = createSupabaseBrowserClient();

  const { data: messagesInCurrentChat } = trpc.getMessagesByChat.useQuery({
    chat_id: currentChat,
  });

  const { data: chats, isLoading: chatsLoading } = trpc.getUserChats.useQuery({
    user_id: userProfile.id,
  });

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
            .eq('chat_id', currentChat)
            .limit(1)
            .single();
          console.log('newMessage: ', newMessage);
          setMessages((prevMessages) => [...prevMessages!, newMessage!]);
          console.log('done');
          console.log('messages: ', messages);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, messages, setMessages]);

  const sendMessage = async () => {
    sendChatMessage.mutate({
      chat_id: currentChat,
      content: message,
    });
    setMessage('');
  };

  const sendChatMessage = trpc.sendChatMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error sending message:', error);
      } else if (data) {
        console.log('Message sent:', data);
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
          router={router}
          sendMessage={sendMessage}
          setMessage={setMessage}
          setCurrentChat={setCurrentChat}
        />
      </div>
      <div className='lg:hidden'>
        {!currentChat ? (
          <RenderChats
            userProfile={userProfile}
            chats={chats!}
            chatsLoading={chatsLoading}
            router={router}
            setCurrentChat={setCurrentChat}
          />
        ) : (
          <div className='flex max-h-screen w-full flex-col justify-between'>
            <div className='fixed top-16 z-40 w-full bg-black py-2 text-center font-bold'>
              <div className='flex flex-row items-center justify-between px-4'>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setCurrentChat('');
                    router.push(`/messages`);
                  }}
                >
                  <ChevronLeft className='-ml-1' />
                  Back
                </Button>
                <div>Chat Name</div>
                <div>Options</div>
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
