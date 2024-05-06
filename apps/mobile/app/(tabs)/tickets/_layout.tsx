import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      initialRouteName="index"
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
          headerTitle: 'Tickets',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="transfer/[id]"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerTitle: 'Transfer Ticket',
        }}
      />
    </Stack>
  );
};
export default Layout;
