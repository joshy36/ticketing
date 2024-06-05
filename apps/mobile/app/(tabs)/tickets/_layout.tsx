import { Stack, router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { TicketsProvider } from '../../../providers/ticketsProvider';
import { useContext } from 'react';
import { SupabaseContext } from '@/providers/supabaseProvider';

const Layout = () => {
  const { userProfile } = useContext(SupabaseContext);
  return (
    <TicketsProvider userProfile={userProfile}>
      <Stack
        initialRouteName='index'
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: '#FFFFFF',
          headerTitle: 'Upcoming Events',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Tickets',
          headerBackTitleVisible: false,
        }}
      /> */}
        <Stack.Screen
          name='scanIn'
          options={{
            presentation: 'modal',
            headerTitle: 'Scan In',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name='x' size={24} color='white' />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name='transfer/[id]'
          options={{
            // Set the presentation mode to modal for our modal route.
            presentation: 'modal',
            headerTitle: 'Transfer Ticket',
          }}
        />
        <Stack.Screen
          name='cancel/[id]'
          options={{
            // Set the presentation mode to modal for our modal route.
            presentation: 'modal',
            headerTitle: 'Cancel Transfer',
          }}
        />
      </Stack>
    </TicketsProvider>
  );
};
export default Layout;
