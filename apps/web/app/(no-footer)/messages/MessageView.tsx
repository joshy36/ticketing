import { Message, UserProfile } from 'supabase';
import { trpc } from '../../_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dateToString } from '@/utils/helpers';
import { useState, useEffect } from 'react';
import { RouterOutputs } from 'api';
import createSupabaseBrowserClient from '@/utils/supabaseBrowser';

export default function MessageView({
  userProfile,
  currentChat,
}: {
  userProfile: UserProfile;
  currentChat: string;
}) {
  const [messages, setMessages] =
    useState<RouterOutputs['getMessagesByChat']>(null);
  const supabase = createSupabaseBrowserClient();

  const { data: messagesInCurrentChat } = trpc.getMessagesByChat.useQuery({
    chat_id: currentChat,
  });

  // let scrollerContent = document.getElementById('scrollerContent');

  // document.getElementById('addItems').addEventListener('click', function () {
  //   let newChild = scrollerContent.lastElementChild.cloneNode(true);
  //   newChild.innerHTML = 'Item ' + (scrollerContent.children.length + 1);
  //   scrollerContent.appendChild(newChild);
  // });

  useEffect(() => {
    console.log('useEffect');
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

  return (
    <div className='scroller'>
      <div className='pr-4'>
        {messages?.map((message, index) => {
          return (
            <div key={message.id} className='py-0.5'>
              {message.from === userProfile.id ? (
                <div className='flex justify-end'>
                  {!(messages[index + 1]?.from === messages[index]?.from) ? (
                    <div className='flex flex-col'>
                      <div className='flex flex-row justify-end'>
                        <div className='mr-2 flex items-center rounded-bl-lg rounded-tl-lg rounded-tr-lg border bg-white px-3 py-1 text-black'>
                          {message.content}
                        </div>
                        <Avatar>
                          {userProfile.profile_image ? (
                            <AvatarImage
                              src={userProfile.profile_image!}
                              alt='pfp'
                            />
                          ) : (
                            <AvatarFallback></AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className='flex justify-end pr-12 pt-1 text-xs font-light text-muted-foreground'>
                        {dateToString(message.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div className='mr-12 flex items-center rounded-lg border bg-white px-3 py-1 text-black'>
                      {message.content}
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex justify-start'>
                  {!(messages[index + 1]?.from === messages[index]?.from) ? (
                    <div className='flex flex-col'>
                      <div className='flex flex-row'>
                        <Avatar>
                          {messages[index]?.user_profiles?.profile_image ? (
                            <AvatarImage
                              src={
                                messages[index]?.user_profiles?.profile_image!
                              }
                              alt='pfp'
                            />
                          ) : (
                            <AvatarFallback></AvatarFallback>
                          )}
                        </Avatar>
                        <div className='ml-2 flex items-center rounded-br-lg rounded-tl-lg rounded-tr-lg border bg-secondary px-3 py-1'>
                          {message.content}
                        </div>
                      </div>
                      <div className='flex justify-start pl-12 pt-1 text-xs font-light text-muted-foreground'>
                        {dateToString(message.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div className='ml-12 flex items-center rounded-lg border bg-secondary px-3 py-1'>
                      {message.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* <div className='scroller'>
        <div className='scroller-content' id='scrollerContent'>
          <div className='item'>Item 1</div>
          <div className='item'>Item 2</div>
          <div className='item'>Item 3</div>
          <div className='item'>Item 4</div>
          <div className='item'>Item 5</div>
          <div className='item'>Item 6</div>
          <div className='item'>Item 7</div>
          <div className='item'>Item 8</div>
          <div className='item'>Item 9</div>
          <div className='item'>Item 10</div>
        </div>
      </div>
      <br />
      <br />
      <button id='addItems'>Add more items</button> */}
    </div>
  );
}
