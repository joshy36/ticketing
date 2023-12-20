import { createRouteClient } from 'supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { CookieOptions, createServerClient } from '@supabase/ssr';

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
  const request = opts.req;
  console.log('request: ', request);
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
      },
    }
  );

  let sessionData;
  let user;
  if (request.headers.get('x-trpc-source') === 'expo-react') {
    if (request.headers.get('mobile-session')) {
      sessionData = JSON.parse(request.headers.get('mobile-session')!);
    }
  } else {
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();
    // sessionData = session;

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    const {
      data: { session: sessionData },
    } = await supabase.auth.getSession();
    console.log('sessionData: ', sessionData);

    user = supabaseUser;
    console.log('user: ', user);
  }

  // if (sessionData) {
  //   user = sessionData.user;
  // } else {
  //   user = null;
  // }

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
