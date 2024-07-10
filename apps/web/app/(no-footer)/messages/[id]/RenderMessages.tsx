import { UserProfile } from 'supabase';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { dateToString } from '~/utils/helpers';
import { useContext } from 'react';
import { MessagesContext } from '~/providers/messagesProvider';
import Link from 'next/link';

export default function RenderMessages({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const { messages } = useContext(MessagesContext);

  return (
    <div className='scroller'>
      <div className='px-2 pb-20 pt-4 md:px-4'>
        {messages?.map((message, index) => {
          return (
            <div key={message.id} className='py-0.5'>
              {message.chat_members?.user_id === userProfile.id ? (
                <div className='flex justify-end'>
                  {!(
                    messages[index + 1]?.chat_members?.user_id ===
                    messages[index]?.chat_members?.user_id
                  ) ? (
                    <div className='flex flex-col'>
                      <div className='flex flex-row justify-end'>
                        <div className='flex items-center rounded-bl-lg rounded-tl-lg rounded-tr-lg border bg-foreground px-3 py-1 text-black'>
                          {message.chat_messages?.content}
                        </div>
                      </div>
                      <div className='flex justify-end pt-1 text-xs font-light text-muted-foreground'>
                        {dateToString(message.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center rounded-lg border bg-foreground px-3 py-1 text-black'>
                      {message.chat_messages?.content}
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex flex-col justify-start'>
                  {!(
                    messages[index - 1]?.chat_members?.user_id ===
                    messages[index]?.chat_members?.user_id
                  ) && (
                    <div className='ml-14 text-xs font-light text-muted-foreground'>
                      {messages[index]?.chat_members?.user_profiles
                        ?.first_name +
                        ' ' +
                        messages[index]?.chat_members?.user_profiles?.last_name}
                    </div>
                  )}
                  {!(
                    messages[index + 1]?.chat_members?.user_id ===
                    messages[index]?.chat_members?.user_id
                  ) ? (
                    <div className='flex flex-col'>
                      <div className='flex flex-row'>
                        <Link
                          href={`/${messages[index]?.chat_members?.user_profiles?.username}`}
                          className='flex items-end'
                        >
                          <Avatar>
                            {messages[index]?.chat_members?.user_profiles
                              ?.profile_image ? (
                              <AvatarImage
                                src={
                                  messages[index]?.chat_members?.user_profiles
                                    ?.profile_image!
                                }
                                alt='pfp'
                              />
                            ) : (
                              <AvatarFallback></AvatarFallback>
                            )}
                          </Avatar>
                        </Link>
                        <div className='ml-2 flex items-center rounded-br-lg rounded-tl-lg rounded-tr-lg border bg-secondary px-3 py-1'>
                          {message.chat_messages?.content}
                        </div>
                      </div>
                      <div className='flex justify-start pl-12 pt-1 text-xs font-light text-muted-foreground'>
                        {dateToString(message.created_at)}
                      </div>
                    </div>
                  ) : !(
                      messages[index - 1]?.chat_members?.user_id ===
                      messages[index]?.chat_members?.user_id
                    ) ? (
                    <div className='ml-12 flex w-fit items-center rounded-lg border bg-secondary px-3 py-1'>
                      {message.chat_messages?.content}
                    </div>
                  ) : (
                    <div className='ml-12 flex w-fit items-center rounded-lg border bg-secondary px-3 py-1'>
                      {message.chat_messages?.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
