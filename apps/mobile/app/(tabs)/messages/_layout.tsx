import { Link, Stack, useGlobalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { SupabaseContext } from '@/providers/supabaseProvider';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text } from 'react-native';
import { MessagesContext } from '@/providers/messagesProvider';
import { Image } from 'expo-image';
import { blurhash, replaceLocalhostWithIP } from '@/utils/helpers';

const Layout = () => {
  const { id } = useGlobalSearchParams();
  const { chats } = useContext(MessagesContext);
  const { session, user, userProfile } = useContext(SupabaseContext);

  const currentChatDetails = chats?.chats?.find(
    (chat) => chat.id === (id! as string),
  );

  const otherUser = currentChatDetails?.chat_members.find(
    (user) => user.user_id != userProfile?.id,
  )?.user_profiles;

  const artist = currentChatDetails?.chat_members.find(
    (member) => member.artists,
  )?.artists;

  const venue = currentChatDetails?.chat_members.find(
    (member) => member.venues,
  )?.venues;

  const artistOrVenue = artist || venue;

  return (
    <Stack
      initialRouteName='index'
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerTitle: 'Messages',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <View>
            {session && user && (
              <Link href='messages/startChat'>
                <View className='flex items-center rounded-full bg-white p-2'>
                  <Feather name='send' size={24} color='black' />
                </View>
              </Link>
            )}
          </View>
        ),
      }}
    >
      <Stack.Screen
        name='[id]'
        options={{
          headerTitle: () => (
            <View>
              {currentChatDetails?.chat_type === 'dm' && (
                <View className='flex flex-row items-center justify-center gap-2'>
                  <Image
                    className='flex h-8 w-8 items-center justify-center rounded-full'
                    source={{
                      uri: replaceLocalhostWithIP(otherUser?.profile_image),
                    }}
                    placeholder={blurhash}
                    contentFit='cover'
                    transition={1000}
                  />
                  <Text className='text-white'>
                    {otherUser?.first_name + ' ' + otherUser?.last_name}
                  </Text>
                </View>
              )}
              {currentChatDetails?.chat_type === 'group' && (
                <View className='flex flex-row items-center justify-center gap-2'></View>
              )}
              {currentChatDetails?.chat_type === 'organization' && (
                <View className='flex flex-row items-center justify-center gap-2'>
                  <Image
                    className='flex h-8 w-8 items-center justify-center rounded-xl'
                    source={{
                      uri: replaceLocalhostWithIP(artistOrVenue?.image),
                    }}
                    placeholder={blurhash}
                    contentFit='cover'
                    transition={1000}
                  />
                  <Text className='text-white'>{artistOrVenue?.name}</Text>
                </View>
              )}
            </View>
          ),
          headerBackTitleVisible: false,
          headerRight: () => (
            <Ionicons
              name={'information-circle-outline'}
              size={25}
              color={'white'}
            />
          ),
        }}
      />
      <Stack.Screen
        name='requests'
        options={{
          headerTitle: 'Friend Requests',
          headerBackTitle: 'Back',
          headerRight: () => <View></View>,
        }}
      />
      <Stack.Screen
        name='startChat'
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerTitle: 'New Message',
          headerRight: () => <View></View>,
        }}
      />
    </Stack>
  );
};
export default Layout;
