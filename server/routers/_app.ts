import { mergeRouters } from '../trpc';

import { eventsRouter } from './events';
import { usersRouter } from './users';
import { ticketsRouter } from './tickets';
import { artistsRouter } from './artists';

export const appRouter = mergeRouters(
  eventsRouter,
  usersRouter,
  ticketsRouter,
  artistsRouter
);

export type AppRouter = typeof appRouter;
