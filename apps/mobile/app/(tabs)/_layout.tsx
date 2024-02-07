import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Foundation } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { blurhash } from '../../utils/helpers';

export default function TabsLayout() {
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
            // return (
            //   <Image
            //     source={require('../../assets/IMG_8615.png')}
            //     placeholder={blurhash}
            //     contentFit="cover"
            //     style={{ borderRadius: 16 }}
            //     className="h-8 w-8"
            //     transition={1000}
            //   />
            // );

            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={30}
              color={color}
            />
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
