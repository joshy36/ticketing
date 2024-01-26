import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerTitle: 'My Tickets',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Tickets',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};
export default Layout;
