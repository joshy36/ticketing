import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Foundation } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { blurhash } from '../../utils/helpers';
import { View, Text } from 'react-native';
import { useContext, useEffect } from 'react';
import { MessagesContext } from './messages/messagesProvider';
import { FriendRequestContext } from './messages/friendRequestsProvider';

export default function TabsLayout() {
  const { unreadMessages } = useContext(MessagesContext);
  const { friendRequests } = useContext(FriendRequestContext);

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: { backgroundColor: '#000000', height: 90 },
      }}
    >
      <Tabs.Screen
        name="home"
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
        name="search"
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
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'ticket-confirmation' : 'ticket-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
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
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text className="text-white text-xs items-center">
                      {unreadMessages + friendRequests?.length}
                    </Text>
                  </View>
                )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
