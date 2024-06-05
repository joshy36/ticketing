import { Artist, Venue } from 'supabase';
import {
  blurhash,
  dateToString,
  replaceLocalhostWithIP,
} from '@/utils/helpers';
import { MessagesContext } from '@/providers/messagesProvider';
import { Link } from 'expo-router';
import { trpc } from '@/utils/trpc';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'expo-image';
import { View, Text, ScrollView } from 'react-native';
import { useContext, useEffect, useRef } from 'react';
import Separator from '@/app/components/Separator';

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

  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      // @ts-ignore
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const artistOrVenue = artist || venue;
  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() =>
        // @ts-ignore
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    >
      <View className='px-4 pb-24 pt-4'>
        {messages?.map((message, index) => {
          return (
            <View key={message.id} className='py-2'>
              <View className='flex flex-col justify-start'>
                <View className='flex flex-col'>
                  <Text className='ml-14 pb-1 text-xs font-light text-muted-foreground'>
                    {artistOrVenue?.name}
                  </Text>
                  <View className='flex flex-row gap-1'>
                    {/* <Link
                      href={
                        artist
                          ? `/artist/${artistOrVenue?.id}`
                          : venue
                            ? `/venue/${artistOrVenue?.id}`
                            : '/'
                      }
                    > */}
                    <View className='flex items-end justify-end'>
                      {artistOrVenue?.image && (
                        <Image
                          style={{ borderRadius: 16 }}
                          className='flex h-12 w-12 items-center justify-center border-2 border-black'
                          source={{
                            uri: replaceLocalhostWithIP(artistOrVenue).image,
                          }}
                          placeholder={blurhash}
                          contentFit='cover'
                          transition={1000}
                        />
                      )}
                    </View>
                    {/* </Link> */}
                    <Link href={`/home/${message.chat_messages?.event_id}`}>
                      <View className='ml-2 flex max-w-xs flex-col rounded-br-xl rounded-tl-xl rounded-tr-xl border bg-zinc-800/80 p-3'>
                        <Text className='pb-2 text-white'>
                          {message.chat_messages?.content}
                        </Text>
                        <Separator />
                        <View className='mt-2 flex flex-row gap-2'>
                          {events[index]?.data?.image && (
                            <Image
                              style={{ borderRadius: 16 }}
                              className='flex h-16 w-16 items-center justify-center'
                              source={{
                                uri: replaceLocalhostWithIP(events[index]?.data)
                                  .image,
                              }}
                              placeholder={blurhash}
                              contentFit='cover'
                              transition={1000}
                            />
                          )}
                          <View className='flex flex-col gap-2'>
                            <Text className='font-light text-white'>
                              {events[index]?.data?.name}
                              {' · '}
                              {events[index]?.data?.date &&
                                dateToString(events[index]?.data?.date!)}
                            </Text>
                            <View className='flex flex-row items-center gap-2'>
                              <Text className='font-bold text-white'>
                                Buy Tickets
                              </Text>
                              <Entypo
                                name='chevron-right'
                                size={20}
                                color='white'
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </Link>
                  </View>

                  <Text className='flex justify-start pl-14 pt-0.5 text-xs font-light text-muted-foreground'>
                    {dateToString(message.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
