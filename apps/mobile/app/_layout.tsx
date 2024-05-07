import { Stack } from 'expo-router';
import { TRPCProvider } from '../utils/trpc';
import { SupabaseProvider } from '../utils/supabaseProvider';
import { StripeProvider } from '@stripe/stripe-react-native';
import { MessagesProvider } from './(tabs)/messages/messagesProvider';
import { FriendRequestProvider } from './(tabs)/messages/friendRequestsProvider';

export default function RootLayout() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY!}>
      <SupabaseProvider>
        <TRPCProvider>
          <MessagesProvider userProfile={null} url={null}>
            <FriendRequestProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </FriendRequestProvider>
          </MessagesProvider>
        </TRPCProvider>
      </SupabaseProvider>
    </StripeProvider>
  );
}
