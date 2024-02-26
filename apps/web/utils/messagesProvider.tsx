'use client';

import { trpc } from '@/app/_trpc/client';
import { createContext, useEffect, useState } from 'react';
import createSupabaseBrowserClient from './supabaseBrowser';
import { usePathname } from 'next/navigation';
import { Message, UserProfile } from 'supabase';

type MessagesProviderProps = {
  children: React.ReactNode;
  userProfile: UserProfile | null | undefined;
};

type MessagesContextProps = {
  unreadMessages: number;
};

export const MessagesContext = createContext<MessagesContextProps>({
  unreadMessages: 0,
});

export const MessagesProvider = ({
  children,
  userProfile,
}: MessagesProviderProps) => {
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const supabase = createSupabaseBrowserClient();
  const { data: unread } = trpc.getTotalUnreadMessages.useQuery();
  const [numberOfUnreadMessagesPerChat, setNumberOfUnreadMessagesPerChat] =
    useState<{
      [id: string]: { unread: number };
    }>();
  const pathname = usePathname();
  const id = usePathname().split('/').pop();

  useEffect(() => {
    if (
      id &&
      numberOfUnreadMessagesPerChat &&
      numberOfUnreadMessagesPerChat[id]
    ) {
      setNumberOfUnreadMessagesPerChat((prevState) => ({
        ...prevState,
        [id]: { unread: 0 },
      }));
    }
  }, [id]);

  useEffect(() => {
    if (numberOfUnreadMessagesPerChat) {
      const totalUnreadMessages = Object.values(
        numberOfUnreadMessagesPerChat!,
      ).reduce((accumulator, chat) => accumulator + chat.unread, 0);

      setUnreadMessages(totalUnreadMessages);
    }
  }, [numberOfUnreadMessagesPerChat]);

  useEffect(() => {
    if (unread) {
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
    }
  }, [unread]);

  useEffect(() => {
    const channel = supabase
      .channel('unread-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const message = payload.new as Message;
          const urlParts = pathname.split('/');
          const currentChat = urlParts[urlParts.length - 1];

          if (
            currentChat !== message.chat_id &&
            userProfile?.id !== message.from
          ) {
            console.log('message');
            setUnreadMessages((prevState) => prevState + 1);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, unreadMessages, setUnreadMessages]);

  return (
    <MessagesContext.Provider value={{ unreadMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};
