import React from 'react';
import Constants from 'expo-constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import { ExpoSecureStoreAdapter } from './supabaseExpo';

import type { AppRouter } from 'api';

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from 'api';

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */

  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0];

  if (!localhost) {
    // return 'https://www.jupiter-tickets.com';
    // return "https://turbo.t3.gg";
    throw new Error(
      'Failed to get localhost. Please point to your production server.'
    );
  }
  if (process.env.EXPO_PUBLIC_ENV === 'prod') {
    return 'https://www.jupiter-tickets.com';
  }

  return `http://${localhost}:3000`;
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */

export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            const headers = new Map<string, string>();
            headers.set('x-trpc-source', 'expo-react');
            const sessionToken =
              await ExpoSecureStoreAdapter.getItem('mobile-session');
            if (sessionToken) {
              headers.set('mobile-session', sessionToken);
            }
            return Object.fromEntries(headers);
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
