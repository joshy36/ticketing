import { mergeRouters } from '../trpc';

import { eventsRouter } from './events';
import { usersRouter } from './users';
import { ticketsRouter } from './tickets';
import { artistsRouter } from './artists';
import { venuesRouter } from './venues';

export const appRouter = mergeRouters(
  eventsRouter,
  usersRouter,
  ticketsRouter,
  artistsRouter,
  venuesRouter,
);

export type AppRouter = typeof appRouter;
