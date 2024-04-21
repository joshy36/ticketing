import {
  createTRPCClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client';
import { cookies } from 'next/headers';
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
      headers() {
        const heads = new Map();
        heads.set('cookie', cookies().toString());
        heads.set('x-trpc-source', 'rsc');
        return Object.fromEntries(heads);
      },
    }),
  ],
});
