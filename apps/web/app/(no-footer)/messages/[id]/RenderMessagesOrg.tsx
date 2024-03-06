import { Artist, UserProfile, Venue } from 'supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dateToString } from '@/utils/helpers';
import { useContext } from 'react';
import { MessagesContext } from '@/utils/messagesProvider';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { ChevronRight } from 'lucide-react';

export default function RenderMessagesOrg({
  artistOrVenue,
}: {
  artistOrVenue: Artist | Venue | null | undefined;
}) {
  const { messages } = useContext(MessagesContext);

  const mess = messages?.map((m) => m.chat_messages?.event_id)!;

  const events = trpc.useQueries(
    (t) => mess?.map((message) => t.getEventById({ id: message! })),
  );

  console.log(events);
  return (
    <div className='scroller'>
      <div className='px-4 pb-20 '>
        {messages?.map((message, index) => {
          return (
            <div key={message.id} className='py-0.5'>
              <div className='flex flex-col justify-start'>
                {!(
                  messages[index - 1]?.chat_members?.user_id ===
                  messages[index]?.chat_members?.user_id
                ) && (
                  <div className='ml-14 text-xs font-light text-muted-foreground'>
                    {artistOrVenue?.name}
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
                          {artistOrVenue?.image ? (
                            <AvatarImage
                              src={artistOrVenue?.image!}
                              alt='pfp'
                            />
                          ) : (
                            <AvatarFallback></AvatarFallback>
                          )}
                        </Avatar>
                      </Link>
                      <Link
                        href={`/event/${message.chat_messages?.event_id}`}
                        className='ml-2 flex flex-col rounded-br-lg rounded-tl-lg rounded-tr-lg border bg-secondary px-3 py-1'
                      >
                        <div>{message.chat_messages?.content}</div>
                        <div className='flex flex-row'>
                          <div className='font-bold'>Buy Tickets</div>
                          <ChevronRight />
                        </div>
                      </Link>
                    </div>
                    <div className='flex justify-start pl-12 pt-1 text-xs font-light text-muted-foreground'>
                      {dateToString(message.created_at)}
                    </div>
                  </div>
                ) : !(
                    messages[index - 1]?.chat_members?.user_id ===
                    messages[index]?.chat_members?.user_id
                  ) ? (
                  <div className='ml-12 flex w-fit rounded-lg border bg-secondary px-3 py-1'>
                    {message.chat_messages?.content}
                  </div>
                ) : (
                  <div className='ml-12 flex w-fit rounded-lg border bg-secondary px-3 py-1'>
                    {message.chat_messages?.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
