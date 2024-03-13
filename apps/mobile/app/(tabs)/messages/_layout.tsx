import { Stack, useLocalSearchParams } from 'expo-router';
import { MessagesProvider } from './messagesProvider';
import { useContext } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import { trpc } from '../../../utils/trpc';
import { supabase } from '../../../utils/supabaseExpo';

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

  return (
    <MessagesProvider
      userProfile={profile!}
      url={id! as string}
      supabase={supabase}
    >
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FFFFFF',
          headerTitle: 'Messages',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="[id]"
          options={{
            headerTitle: 'Message',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </MessagesProvider>
  );
};
export default Layout;
