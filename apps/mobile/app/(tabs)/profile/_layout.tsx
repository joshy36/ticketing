import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerTitle: 'Profile',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Profile',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Ticket',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};
export default Layout;
