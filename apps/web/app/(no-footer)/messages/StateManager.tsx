'use client';

import { Message, UserProfile } from 'supabase';
import Messages from './Messages';
import { useEffect, useState } from 'react';
import { RouterOutputs, trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/utils/supabaseBrowser';

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

  const { data: chats } = trpc.getUserChats.useQuery({
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
      <Messages
        userProfile={userProfile!}
        message={message}
        messages={messages}
        chats={chats!}
        router={router}
        sendMessage={sendMessage}
        setMessage={setMessage}
        setCurrentChat={setCurrentChat}
      />
    </div>
  );
}
