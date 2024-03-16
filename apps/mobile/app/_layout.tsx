import { Stack } from 'expo-router';
import { TRPCProvider } from '../utils/trpc';
import { SupabaseProvider } from '../utils/supabaseProvider';
import { StripeProvider } from '@stripe/stripe-react-native';
import { MessagesProvider } from './(tabs)/messages/messagesProvider';

export default function RootLayout() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY!}>
      <SupabaseProvider>
        <TRPCProvider>
          <MessagesProvider userProfile={null} url={null}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </MessagesProvider>
        </TRPCProvider>
      </SupabaseProvider>
    </StripeProvider>
  );
}
