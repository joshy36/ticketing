import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client';
import { cookies } from 'next/headers';
import fetchPonyfill from 'fetch-ponyfill';

import { type AppRouter } from 'api';
import { getUrl, transformer } from './shared';

export const serverClient = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    // loggerLink({
    //   enabled: (op) =>
    //     process.env.NODE_ENV === 'development' ||
    //     (op.direction === 'down' && op.result instanceof Error),
    // }),
    unstable_httpBatchStreamLink({
      url: getUrl(),
      fetch: fetchPonyfill().fetch,
      headers() {
        const heads = new Map();
        heads.set('cookie', cookies().toString());
        heads.set('x-trpc-source', 'rsc');
        heads.set('Access-Control-Allow-Credentials', 'true');
        heads.set('Access-Control-Allow-Origin', '*');
        heads.set(
          'Access-Control-Allow-Methods',
          'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        );
        heads.set(
          'Access-Control-Allow-Headers',
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        );
        return Object.fromEntries(heads);
      },
    }),
  ],
});
