import { UserProfile } from 'supabase';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  blurhash,
  dateToString,
  replaceLocalhostWithIP,
} from '../../../utils/helpers';
import { useContext, useEffect, useRef } from 'react';
// import { MessagesContext } from 'providers';
import { MessagesContext } from '../../../providers/messagesProvider';
import { Image } from 'expo-image';
import { View, Text, ScrollView } from 'react-native';

export default function RenderMessages({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const { messages } = useContext(MessagesContext);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      // @ts-ignore
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() =>
        // @ts-ignore
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    >
      <View className="px-4">
        {messages?.map((message, index) => {
          return (
            <View key={message.id} className="py-0.5">
              {message.chat_members?.user_id === userProfile?.id ? (
                <View className="flex justify-end">
                  {!(
                    messages[index + 1]?.chat_members?.user_id ===
                    messages[index]?.chat_members?.user_id
                  ) ? (
                    <View className="flex flex-col">
                      <View className="flex flex-row justify-end">
                        <View className="flex rounded-bl-xl rounded-tl-xl rounded-tr-xl border bg-white">
                          <Text className="flex items-center px-3 py-2 text-black">
                            {message.chat_messages?.content}
                          </Text>
                        </View>
                      </View>
                      <View className="flex flex-row justify-end">
                        <Text className="pt-1 text-xs font-light text-muted-foreground">
                          {dateToString(message.created_at)}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className="flex flex-row justify-end">
                      <View className="flex rounded-xl bg-white">
                        <Text className="rounded-lg px-3 py-2 text-black">
                          {message.chat_messages?.content}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View className="flex flex-col justify-start">
                  {!(
                    messages[index - 1]?.chat_members?.user_id ===
                    messages[index]?.chat_members?.user_id
                  ) && (
                    <Text className="ml-14 text-xs font-light text-muted-foreground">
                      {messages[index]?.chat_members?.user_profiles
                        ?.first_name +
                        ' ' +
                        messages[index]?.chat_members?.user_profiles?.last_name}
                    </Text>
                  )}
                  {!(
                    messages[index + 1]?.chat_members?.user_id ===
                    messages[index]?.chat_members?.user_id
                  ) ? (
                    <View className="flex flex-col">
                      <View className="flex flex-row">
                        {/* <Link */}
                        <View
                          // href={`/${messages[index]?.chat_members?.user_profiles?.username}`}
                          className="flex items-end"
                        >
                          {messages[index]?.chat_members?.user_profiles
                            ?.profile_image ? (
                            // <AvatarImage src={userProfile?.profile_image!} alt='pfp' />
                            <Image
                              className="h-10 w-10 rounded-full flex justify-center items-center"
                              source={{
                                uri: replaceLocalhostWithIP(
                                  messages[index]?.chat_members?.user_profiles
                                ).profile_image,
                              }}
                              placeholder={blurhash}
                              contentFit="cover"
                              transition={1000}
                            />
                          ) : (
                            // <AvatarFallback></AvatarFallback>
                            <View></View>
                          )}
                        </View>
                        {/* </Link> */}
                        <View className="ml-2 flex rounded-br-xl rounded-tl-xl rounded-tr-xl bg-zinc-800/80 max-w-xs">
                          <Text className="items-center px-3 py-2 text-white">
                            {message.chat_messages?.content}
                          </Text>
                        </View>
                      </View>
                      <Text className="flex justify-start pl-12 pt-1 text-xs font-light text-muted-foreground">
                        {dateToString(message.created_at)}
                      </Text>
                    </View>
                  ) : !(
                      messages[index - 1]?.chat_members?.user_id ===
                      messages[index]?.chat_members?.user_id
                    ) ? (
                    <View className="flex flex-row">
                      <View className="bg-zinc-800/80 rounded-xl w-fit flex ml-12 ">
                        <Text className="flex items-center  px-3 py-2 text-white">
                          {message.chat_messages?.content}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className="flex flex-row">
                      <View className="bg-zinc-800/80 rounded-xl ml-12 flex w-fit">
                        <Text className="items-center rounded-lg border px-3 py-2 text-white">
                          {message.chat_messages?.content}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
