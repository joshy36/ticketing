import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { mergeRouters } from '../trpc';

import { eventsRouter } from './events';
import { usersRouter } from './users';
import { ticketsRouter } from './tickets';
import { artistsRouter } from './artists';
import { venuesRouter } from './venues';
import { paymentsRouter } from './payments';
import { sbtsRouter } from './sbts';
import { collectiblesRouter } from './collectibles';

export const appRouter = mergeRouters(
  eventsRouter,
  usersRouter,
  ticketsRouter,
  artistsRouter,
  venuesRouter,
  paymentsRouter,
  sbtsRouter,
  collectiblesRouter
);

export type AppRouter = typeof appRouter;

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
