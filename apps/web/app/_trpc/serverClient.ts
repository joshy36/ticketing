import { httpBatchLink } from '@trpc/client';

import { appRouter } from 'api';

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`,
    }),
  ],
});
