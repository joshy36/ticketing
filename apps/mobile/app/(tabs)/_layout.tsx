import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useContext } from 'react';
import { MessagesContext } from '../../providers/messagesProvider';
import { FriendRequestContext } from '../../providers/friendRequestsProvider';
import { SupabaseContext } from '../../providers/supabaseProvider';
import { Image } from 'expo-image';
import { blurhash, replaceLocalhostWithIP } from '../../utils/helpers';
import { TicketsContext } from '../../providers/ticketsProvider';

export default function TabsLayout() {
  const { userProfile } = useContext(SupabaseContext);
  const { unreadMessages } = useContext(MessagesContext);
  const { friendRequests } = useContext(FriendRequestContext);
  const { pendingPushRequsts, numberOfTicketsNeedToTransfer } =
    useContext(TicketsContext);

  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          height: 90,
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(255, 255, 255, 0.2)',
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home-variant' : 'home-variant-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='tickets'
        options={{
          title: 'Tickets',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ position: 'relative' }}>
              <MaterialCommunityIcons
                name={focused ? 'ticket-confirmation' : 'ticket-outline'}
                size={30}
                color={color}
              />
              {pendingPushRequsts &&
                pendingPushRequsts?.length + numberOfTicketsNeedToTransfer >
                  0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      backgroundColor: '#b91c1c',
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      width: 18,
                      height: 18,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text className='items-center text-xs text-white'>
                      {pendingPushRequsts?.length +
                        numberOfTicketsNeedToTransfer}
                    </Text>
                  </View>
                )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='messages'
        options={{
          title: 'Messages',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={focused ? 'chatbubble' : 'chatbubble-outline'}
                size={30}
                color={color}
              />
              {friendRequests &&
                unreadMessages + friendRequests?.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      backgroundColor: '#1d4ed8',
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      width: 18,
                      height: 18,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text className='items-center text-xs text-white'>
                      {unreadMessages + friendRequests?.length}
                    </Text>
                  </View>
                )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              {userProfile ? (
                <View>
                  {focused ? (
                    <Image
                      className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white'
                      source={{
                        uri: replaceLocalhostWithIP(userProfile).profile_image,
                      }}
                      placeholder={blurhash}
                      contentFit='cover'
                      transition={1000}
                    />
                  ) : (
                    <Image
                      className='flex h-8 w-8 items-center justify-center rounded-full'
                      source={{
                        uri: replaceLocalhostWithIP(userProfile).profile_image,
                      }}
                      placeholder={blurhash}
                      contentFit='cover'
                      transition={1000}
                    />
                  )}
                </View>
              ) : (
                <Ionicons
                  name={focused ? 'person-circle' : 'person-circle-outline'}
                  size={30}
                  color={color}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
