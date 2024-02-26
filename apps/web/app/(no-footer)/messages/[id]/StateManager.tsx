'use client';

import { Message, UserProfile } from 'supabase';
import LargeScreenMessages from './LargeScreenMessages';
import { useEffect, useState } from 'react';
import { RouterOutputs, trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/utils/supabaseBrowser';
import RenderChats from './RenderChats';
import RenderMessages from './RenderMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import GroupCard from './GroupCard';
import { MessagesContext } from '@/utils/messagesProvider';

export default function StateManager({
  userProfile,
  id,
}: {
  userProfile: UserProfile;
  id: string;
}) {
  const router = useRouter();
  const currentChat = id;
  const [message, setMessage] = useState('');
  const [messages, setMessages] =
    useState<RouterOutputs['getMessagesByChat']>(null);
  const [mostRecentMessageByChat, setMostRecentMessageByChat] = useState<{
    [id: string]: {
      message: string;
      created_at: string;
    };
  }>();
  const [lastReadMessageByChat, setLastReadMessageByChat] = useState<{
    [id: string]: {
      message: string;
      created_at: string;
    };
  }>();
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

  const currentChatDetails = chats?.chats?.find(
    (chat) => chat.id === currentChat,
  );

  const readMessages = trpc.readMessages.useMutation();

  useEffect(() => {
    if (messagesInCurrentChat) {
      setMessages(messagesInCurrentChat);
      // set last read message
      readMessages.mutate({
        chat_id: currentChat,
      });
      setLastReadMessageByChat((prevState) => ({
        ...prevState,
        [currentChat!]: {
          message:
            messagesInCurrentChat[messagesInCurrentChat.length - 1]?.content!,
          created_at:
            messagesInCurrentChat[messagesInCurrentChat.length - 1]
              ?.created_at!,
        },
      }));
    }
  }, [messagesInCurrentChat]);

  useEffect(() => {
    if (chats?.messagesInChats) {
      for (let i = 0; i < chats?.messagesInChats?.length; i++) {
        setMostRecentMessageByChat((prevState) => ({
          ...prevState,
          [chats?.chats![i]?.id!]: {
            message: chats?.messagesInChats[i]?.[0]?.content!,
            created_at: chats?.messagesInChats[i]?.[0]?.created_at!,
          },
        }));

        setLastReadMessageByChat((prevState) => ({
          ...prevState,
          [chats?.chats![i]?.id!]: {
            message: chats?.lastReadMessages[i]?.content!,
            created_at: chats?.lastReadMessages[i]?.created_at!,
          },
        }));
      }
    }
  }, [chats]);

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
          // only update messages if the chat is the current chat
          if (message.chat_id === currentChat) {
            const { data: newMessage } = await supabase
              .from('chat_messages')
              .select(`*, user_profiles(*)`)
              .eq('id', message.id)
              .eq('chat_id', currentChat!)
              .limit(1)
              .single();

            setLastReadMessageByChat((prevState) => ({
              ...prevState,
              [message.chat_id!]: {
                message: message.content!,
                created_at: message.created_at!,
              },
            }));

            setMessages((prevMessages) => [...prevMessages!, newMessage!]);
          }
          setMostRecentMessageByChat((prevState) => ({
            ...prevState,
            [message.chat_id!]: {
              message: message.content!,
              created_at: message.created_at!,
            },
          }));
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
    return chats?.chats
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
        <LargeScreenMessages
          userProfile={userProfile!}
          message={message}
          messages={messages}
          chats={chats!}
          chatsLoading={chatsLoading}
          currentChat={currentChat}
          mostRecentMessageByChat={mostRecentMessageByChat}
          lastReadMessageByChat={lastReadMessageByChat}
          router={router}
          sendMessage={sendMessage}
          setMessage={setMessage}
        />
      </div>
      <div className='lg:hidden'>
        {!currentChat ? (
          <RenderChats
            userProfile={userProfile}
            chats={chats!}
            chatsLoading={chatsLoading}
            currentChat={currentChat}
            mostRecentMessageByChat={mostRecentMessageByChat}
            lastReadMessageByChat={lastReadMessageByChat}
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
                  <ChevronLeft />
                </Button>
                {currentChatDetails?.chat_type === 'dm' ? (
                  <ProfileCard
                    userProfile={getRandomUserFromChat(currentChat)}
                  />
                ) : (
                  <div>
                    {currentChatDetails ? (
                      <GroupCard
                        userProfile={userProfile}
                        chatMembers={currentChatDetails?.chat_members.map(
                          (member) => member.user_profiles!,
                        )}
                        mostRecentMessage={null}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
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
