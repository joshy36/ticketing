import { Artist, Venue } from 'supabase';
import { dateToString } from '~/utils/helpers';
import { useContext } from 'react';
import { MessagesContext } from '~/providers/messagesProvider';

import Link from 'next/link';
import { trpc } from '~/app/_trpc/client';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function RenderMessagesOrg({
  artist,
  venue,
}: {
  artist: Artist | null | undefined;
  venue: Venue | null | undefined;
}) {
  const { messages } = useContext(MessagesContext);

  const mess = messages?.map((m) => m.chat_messages?.event_id)!;

  const events = trpc.useQueries((t) =>
    mess?.map((message) => t.getEventById({ id: message! })),
  );

  const artistOrVenue = artist || venue;
  return (
    <div className='scroller'>
      <div className='px-4 pb-20 pt-4'>
        {messages?.map((message, index) => {
          return (
            <div key={message.id} className='py-2'>
              <div className='flex flex-col justify-start'>
                <div className='flex flex-col'>
                  <div className='ml-16 text-xs font-light text-muted-foreground'>
                    {artistOrVenue?.name}
                  </div>
                  <div className='flex flex-row'>
                    <Link
                      href={
                        artist
                          ? `/artist/${artistOrVenue?.id}`
                          : venue
                            ? `/venue/${artistOrVenue?.id}`
                            : '/'
                      }
                      className='flex items-end'
                    >
                      {artistOrVenue?.image && (
                        <Image
                          src={artistOrVenue?.image!}
                          alt='img'
                          width={50}
                          height={50}
                          className='h-12 w-12 rounded-md object-contain'
                        />
                      )}
                    </Link>

                    <Link
                      href={`/event/${message.chat_messages?.event_id}`}
                      className='ml-2 flex flex-col rounded-br-lg rounded-tl-lg rounded-tr-lg border bg-secondary px-3 py-1'
                    >
                      <div className='pb-2'>
                        {message.chat_messages?.content}
                      </div>
                      <div className='flex flex-row gap-4 border-t border-muted-foreground pt-2'>
                        {events[index]?.data?.image && (
                          <Image
                            src={events[index]?.data?.image!}
                            alt='img'
                            width={100}
                            height={100}
                            className='h-16 w-16 rounded-md object-contain'
                          />
                        )}
                        <div className='flex flex-col gap-2'>
                          <div className='font-light'>
                            {events[index]?.data?.name}
                            {' · '}
                            {events[index]?.data?.date &&
                              dateToString(events[index]?.data?.date!)}
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='font-bold'>Buy Tickets</div>
                            <ChevronRight />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className='flex justify-start pl-14 pt-1 text-xs font-light text-muted-foreground'>
                    {dateToString(message.created_at)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
