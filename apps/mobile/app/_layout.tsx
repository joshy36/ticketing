import { Stack, useGlobalSearchParams } from 'expo-router';
import { TRPCProvider } from '../utils/trpc';
import { SupabaseProvider } from '../providers/supabaseProvider';
import { StripeProvider } from '@stripe/stripe-react-native';
import { MessagesProvider } from '../providers/messagesProvider';
import { FriendRequestProvider } from '../providers/friendRequestsProvider';
import { TicketsProvider } from '../providers/ticketsProvider';

export default function RootLayout() {
  const glob = useGlobalSearchParams();

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY!}>
      <TRPCProvider>
        <SupabaseProvider>
          <MessagesProvider url={glob.id! as string}>
            <FriendRequestProvider>
              <TicketsProvider>
                <Stack>
                  <Stack.Screen
                    name='(tabs)'
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name='confirmation'
                    options={{
                      headerShown: false,
                      presentation: 'modal',
                    }}
                  />
                </Stack>
              </TicketsProvider>
            </FriendRequestProvider>
          </MessagesProvider>
        </SupabaseProvider>
      </TRPCProvider>
    </StripeProvider>
  );
}
