import { Stack } from 'expo-router';
import { TRPCProvider } from '../utils/trpc';
import { SupabaseProvider } from '../utils/supabaseProvider';

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <TRPCProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TRPCProvider>
    </SupabaseProvider>
  );
}
