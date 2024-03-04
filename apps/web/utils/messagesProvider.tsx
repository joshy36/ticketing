'use client';

import { RouterOutputs, trpc } from '@/app/_trpc/client';
import { createContext, useEffect, useState } from 'react';
import createSupabaseBrowserClient from './supabaseBrowser';
import { usePathname } from 'next/navigation';
import { Message, UserProfile } from 'supabase';

type MessagesProviderProps = {
  children: React.ReactNode;
  userProfile: UserProfile | null | undefined;
};

type MessagesContextProps = {
  userProfile: UserProfile | null | undefined;
  unreadMessages: number;
  mostRecentMessageByChat?: {
    [id: string]: {
      message: string;
      created_at: string;
    };
  };
  numberOfUnreadMessagesPerChat?: {
    [id: string]: { unread: number };
  };
  chats?: RouterOutputs['getUserChats'];
  messages?: RouterOutputs['getMessagesByChat'];
  currentChat: string | null;
};

export const MessagesContext = createContext<MessagesContextProps>({
  userProfile: null,
  unreadMessages: 0,
  mostRecentMessageByChat: {},
  messages: [],
  currentChat: null,
});

export const MessagesProvider = ({
  children,
  userProfile,
}: MessagesProviderProps) => {
  const [didFetch, setDidFetch] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<RouterOutputs['getMessagesByChat']>(
    [],
  );
  const [numberOfUnreadMessagesPerChat, setNumberOfUnreadMessagesPerChat] =
    useState<{
      [id: string]: { unread: number };
    }>();
  const [mostRecentMessageByChat, setMostRecentMessageByChat] = useState<{
    [id: string]: {
      message: string;
      created_at: string;
    };
  }>();

  const url = usePathname().split('/');

  const supabase = createSupabaseBrowserClient();

  const { data: unread } = trpc.getTotalUnreadMessages.useQuery();
  const { data: messagesInCurrentChat } = trpc.getMessagesByChat.useQuery({
    chat_id: currentChat,
  });
  const {
    data: chats,
    isLoading: chatsLoading,
    refetch,
  } = trpc.getUserChats.useQuery({
    user_id: userProfile?.id,
  });

  const readMessages = trpc.readMessages.useMutation();

  useEffect(() => {
    if (url && url[url.length - 2] === 'messages') {
      setCurrentChat(url[url.length - 1]!);
    } else {
      setCurrentChat(null);
    }
  }, [url]);

  useEffect(() => {
    if (
      currentChat &&
      numberOfUnreadMessagesPerChat &&
      numberOfUnreadMessagesPerChat[currentChat]
    ) {
      setNumberOfUnreadMessagesPerChat((prevState) => ({
        ...prevState,
        [currentChat]: { unread: 0 },
      }));
    }
  }, [currentChat]);

  useEffect(() => {
    if (numberOfUnreadMessagesPerChat) {
      const totalUnreadMessages = Object.values(
        numberOfUnreadMessagesPerChat!,
      ).reduce((accumulator, chat) => accumulator + chat.unread, 0);
      setUnreadMessages(totalUnreadMessages);
    }
  }, [numberOfUnreadMessagesPerChat]);

  useEffect(() => {
    if (unread && !didFetch) {
      for (let i = 0; i < unread.length; i++) {
        setNumberOfUnreadMessagesPerChat((prevState) => ({
          ...prevState,
          [unread[i]!.chat]: { unread: unread[i]!.unreadMessages },
        }));
      }
      const totalUnreadMessages = unread.reduce((accumulator, currentChat) => {
        return accumulator + currentChat.unreadMessages;
      }, 0);
      setUnreadMessages(totalUnreadMessages);
      setDidFetch(true);
    }
  }, [unread]);

  // can maybe do this on first load from server?
  // this is initially setting the most recent message for each chat
  useEffect(() => {
    if (chats?.messagesInChats) {
      for (let i = 0; i < chats?.messagesInChats?.length; i++) {
        setMostRecentMessageByChat((prevState) => ({
          ...prevState,
          [chats?.chats![i]?.id!]: {
            message: chats?.messagesInChats[i]?.[0]?.chat_messages?.content!,
            created_at: chats?.messagesInChats[i]?.[0]?.chat_messages?.content!,
          },
        }));
      }
    }
  }, [chats]);

  useEffect(() => {
    if (messagesInCurrentChat) {
      setMessages(messagesInCurrentChat);
      // set last read message
      if (currentChat) {
        readMessages.mutate({
          chat_id: currentChat,
        });
      }
    }
  }, [messagesInCurrentChat]);

  useEffect(() => {
    const channel = supabase
      .channel('unread-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        async (payload) => {
          const message = payload.new as Message;
          // only update messages if the chat is the current chat
          if (message.chat_id === currentChat) {
            const { data: messages } = await supabase
              .from('chat_member_messages')
              .select(`*, chat_members(*, user_profiles(*)), chat_messages(*)`)
              .eq('chat_members.chat_id', currentChat)
              .order('created_at', {
                referencedTable: 'chat_messages',
                ascending: true,
              });

            const newMessage = messages![messages!.length - 1];
            setMessages((prevMessages) => [...prevMessages!, newMessage!]);
          }

          if (
            currentChat !== message.chat_id &&
            userProfile?.id !== message.from
          ) {
            setUnreadMessages((prevState) => prevState + 1);
            setNumberOfUnreadMessagesPerChat((prevState) => ({
              ...prevState,
              [message.chat_id!]: {
                unread:
                  prevState && prevState[message.chat_id!]
                    ? prevState[message.chat_id!]!.unread + 1
                    : 1,
              },
            }));
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
  }, [
    supabase,
    unreadMessages,
    setUnreadMessages,
    setMostRecentMessageByChat,
    currentChat,
    setMessages,
    userProfile,
  ]);

  return (
    <MessagesContext.Provider
      value={{
        userProfile,
        unreadMessages,
        mostRecentMessageByChat,
        numberOfUnreadMessagesPerChat,
        chats,
        messages,
        currentChat,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
