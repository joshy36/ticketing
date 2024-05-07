import {
  Link,
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
} from 'expo-router';
import { MessagesProvider } from './messagesProvider';
import { useContext } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import { trpc } from '../../../utils/trpc';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

const Layout = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;
  const { data: profile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery(
      {
        id: user?.id!,
      },
      { enabled: !!user }
    );

  const { id } = useLocalSearchParams();
  const local = useLocalSearchParams();
  console.log('local: ', local);
  console.log('id: ', id);

  return (
    <MessagesProvider userProfile={profile!} url={id! as string}>
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
    </MessagesProvider>
  );
};
export default Layout;
