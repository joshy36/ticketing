import createRouteClient from '@/lib/supabaseRoute';
import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const middleware = t.middleware;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

const noAuth = middleware(async (opts) => {
  const supabase = createRouteClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  return opts.next({
    ctx: {
      user: user,
      supabase: supabase,
    },
  });
});

const isAuth = middleware(async (opts) => {
  const supabase = createRouteClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      user: user,
      supabase: supabase,
    },
  });
});

export const publicProcedure = t.procedure.use(noAuth);
export const privateProcedure = t.procedure.use(isAuth);
