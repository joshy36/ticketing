import { createTRPCClient, loggerLink, httpBatchLink } from '@trpc/client';
import { headers } from 'next/headers';
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
    httpBatchLink({
      transformer: SuperJSON,
      url: getUrl(),
      fetch: fetchPonyfill().fetch,
      headers: () => {
        const h = new Map(headers());
        h.delete('connection');
        h.delete('transfer-encoding');
        h.set('x-trpc-source', 'server');
        console.log('headers', Object.fromEntries(h));
        return Object.fromEntries(h.entries());
      },
    }),
  ],
});
