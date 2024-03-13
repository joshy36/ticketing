import { Artist, Venue } from 'supabase';
import {
  blurhash,
  dateToString,
  replaceLocalhostWithIP,
} from '../../../utils/helpers';
import { useContext } from 'react';
// import { MessagesContext } from 'providers';
import { MessagesContext } from './messagesProvider';
import { Link } from 'expo-router';
import { trpc } from '../../../utils/trpc';
// import { ChevronRight } from 'lucide-react';
import { Image } from 'expo-image';
import { View, Text, ScrollView } from 'react-native';

export default function RenderMessagesOrg({
  artist,
  venue,
}: {
  artist: Artist | null | undefined;
  venue: Venue | null | undefined;
}) {
  const { messages } = useContext(MessagesContext);

  const mess = messages?.map((m) => m.chat_messages?.event_id)!;

  const events = trpc.useQueries(
    (t) => mess?.map((message) => t.getEventById({ id: message! }))
  );

  const artistOrVenue = artist || venue;
  return (
    <ScrollView>
      <View className="px-4 pt-4">
        {messages?.map((message, index) => {
          return (
            <View key={message.id} className="py-2">
              <View className="flex flex-col justify-start ">
                <View className="flex flex-col ">
                  <Text className="ml-16 text-xs font-light text-muted-foreground ">
                    {artistOrVenue?.name}
                  </Text>
                  <View className="flex flex-row">
                    <Link
                      href={
                        artist
                          ? `/artist/${artistOrVenue?.id}`
                          : venue
                          ? `/venue/${artistOrVenue?.id}`
                          : '/'
                      }
                      className="flex items-end"
                    >
                      {artistOrVenue?.image && (
                        <Image
                          className="h-16 w-16 rounded-full flex justify-center items-center border-2 border-black"
                          source={{
                            uri: replaceLocalhostWithIP(artistOrVenue).image,
                          }}
                          placeholder={blurhash}
                          contentFit="cover"
                          transition={1000}
                        />
                      )}
                    </Link>

                    <Link
                      href={`/home/${message.chat_messages?.event_id}`}
                      className="ml-2 flex max-w-xs flex-col rounded-br-xl rounded-tl-xl rounded-tr-xl border bg-zinc-800/80 px-3 py-1"
                    >
                      <Text className="pb-2 text-white">
                        {message.chat_messages?.content}
                      </Text>
                      <View className="flex flex-row gap-4 pt-2 mt-4">
                        {events[index]?.data?.image && (
                          <Image
                            style={{ borderRadius: 16 }}
                            className="h-16 w-16 flex justify-center items-center"
                            source={{
                              uri: replaceLocalhostWithIP(events[index]?.data)
                                .image,
                            }}
                            placeholder={blurhash}
                            contentFit="cover"
                            transition={1000}
                          />
                        )}
                        <View className="flex flex-col gap-2">
                          <Text className="font-light text-white">
                            {events[index]?.data?.name}
                            {' · '}
                            {events[index]?.data?.date &&
                              dateToString(events[index]?.data?.date!)}
                          </Text>
                          <View className="flex flex-row gap-2">
                            <Text className="font-bold text-white">
                              Buy Tickets
                            </Text>
                            {/* <ChevronRight /> */}
                          </View>
                        </View>
                      </View>
                    </Link>
                  </View>
                  <Text className="flex justify-start pl-14 pt-1 text-xs font-light text-muted-foreground">
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
