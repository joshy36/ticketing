import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client';
import { cookies } from 'next/headers';

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
      headers() {
        const heads = new Map();
        heads.set('cookie', cookies().toString());
        heads.set('x-trpc-source', 'rsc');
        console.log(Object.fromEntries(heads));
        return Object.fromEntries(heads);
      },
    }),
  ],
});
