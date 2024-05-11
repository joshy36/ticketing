import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

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
          headerTitle: 'Scan Tickets',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="checkout/[id]"
        options={{
          headerTitle: 'Checkout',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="artist/[id]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="venue/[id]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="user/[id]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack>
  );
};
export default Layout;
