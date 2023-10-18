import { Stack } from 'expo-router';
import { TRPCProvider } from '../utils/trpc';

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TRPCProvider>
  );
}
