import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Foundation } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabsLayout() {
  return (
    <BlurView
      intensity={50}
      tint="light"
      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}
    >
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarStyle: { backgroundColor: 'rgba(0,0,0,0.0)', height: 90 },
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
    </BlurView>
  );
}
