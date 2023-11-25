import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerTitle: 'Upcoming Events',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="scan/[id]"
        options={{
          headerTitle: 'Scan Ticket',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="checkout/[id]"
        options={{
          headerTitle: 'Purchase Ticket',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};
export default Layout;
