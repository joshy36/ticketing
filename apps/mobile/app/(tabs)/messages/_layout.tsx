import { Link, Stack } from 'expo-router';
import { useContext } from 'react';
import { SupabaseContext } from '../../../providers/supabaseProvider';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

const Layout = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerTitle: 'Messages',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <View>
            {session && user && (
              <Link href="messages/startChat">
                <View className="bg-white p-2 rounded-full flex items-center ">
                  <Feather name="send" size={24} color="black" />
                </View>
              </Link>
            )}
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Message',
          headerBackTitle: 'Back',
          headerRight: () => (
            <Ionicons
              name={'information-circle-outline'}
              size={25}
              color={'white'}
            />
          ),
        }}
      />
      <Stack.Screen
        name="requests"
        options={{
          headerTitle: 'Friend Requests',
          headerBackTitle: 'Back',
          headerRight: () => <View></View>,
        }}
      />
      <Stack.Screen
        name="startChat"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          headerTitle: 'New Message',
          headerRight: () => <View></View>,
        }}
      />
    </Stack>
  );
};
export default Layout;
