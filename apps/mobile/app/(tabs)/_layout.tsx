import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="home">
      <Tabs.Screen
        name="home"
        options={{ headerShown: false, tabBarActiveTintColor: 'black' }}
      />
      <Tabs.Screen
        name="search"
        options={{ headerShown: false, tabBarActiveTintColor: 'black' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ headerShown: false, tabBarActiveTintColor: 'black' }}
      />
    </Tabs>
  );
}
