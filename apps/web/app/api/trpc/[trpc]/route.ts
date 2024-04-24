import { appRouter } from 'api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from 'api/src/trpc';
import type { NextRequest } from 'next/server';

export const config = {
  maxDuration: 300,
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
  });

export { handler as GET, handler as POST };
