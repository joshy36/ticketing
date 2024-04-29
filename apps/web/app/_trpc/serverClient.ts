import {
  createTRPCClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client';
import { cookies, headers } from 'next/headers';
import fetchPonyfill from 'fetch-ponyfill';

import { type AppRouter } from 'api';
import { getUrl } from './shared';
import SuperJSON from 'superjson';

export const serverClient = createTRPCClient<AppRouter>({
  links: [
    // loggerLink({
    //   enabled: (op) =>
    //     process.env.NODE_ENV === 'development' ||
    //     (op.direction === 'down' && op.result instanceof Error),
    // }),
    unstable_httpBatchStreamLink({
      transformer: SuperJSON,
      url: getUrl(),
      fetch: fetchPonyfill().fetch,
      headers: () => {
        const h = new Map(headers());
        // h.delete('connection');
        // h.delete('transfer-encoding');
        // h.delete('content-length');
        h.set('x-trpc-source', 'server');
        return Object.fromEntries(h.entries());
      },
    }),
  ],
});
