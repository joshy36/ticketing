import { createRouteClient } from 'supabase';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

type CreateContextOptions = {
  user: any;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  const supabase = createRouteClient();
  return {
    user: opts.user,
    supabase,
  };
};

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const { req } = opts;
  const res = NextResponse.next();
  const supabase = createRouteClient();

  let sessionData;
  let user;
  if (opts.req.headers.get('x-trpc-source') === 'expo-react') {
    if (req.headers.get('mobile-session')) {
      sessionData = JSON.parse(req.headers.get('mobile-session')!);
    }
  } else {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    sessionData = session;
  }
  console.log('sessionData: ', sessionData);

  if (sessionData) {
    user = sessionData.user;
  } else {
    user = null;
  }

  return createInnerTRPCContext({
    user,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

const isAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ctx,
    },
  });
});

export const authedProcedure = t.procedure.use(isAuth);
