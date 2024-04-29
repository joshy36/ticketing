import { TRPCError } from '@trpc/server';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import sha256 from 'crypto-js/sha256';

export const usersRouter = router({
  getAllUsers: authedProcedure.query(async ({ ctx, input }) => {
    const supabase = ctx.supabase;
    const { data } = await supabase.from('user_profiles').select();
    return data;
  }),

  getUserProfile: publicProcedure
    .input(
      z.object({ id: z.string().optional(), username: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      if (input.id) {
        const { data } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', input.id)
          .limit(1)
          .single();
        return data;
      } else if (input.username) {
        const { data } = await supabase
          .from('user_profiles')
          .select()
          .eq('username', input.username)
          .limit(1)
          .single();
        return data;
      }
    }),

  getUserSalt: authedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      if (user.id !== input.user_id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to view this user',
        });
      }

      const { data } = await supabase
        .from('user_salts')
        .select()
        .eq('user_id', input.user_id)
        .single();

      return data;
    }),

  getUpcomingEventsForUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: upcomingTickets } = await supabase
        .from('tickets')
        .select('*')
        .eq('owner_id', input.user_id)
        .eq('scanned', false);

      const eventIds = upcomingTickets?.map((ticket) => ticket.event_id!);
      const uniqueEventIds = [...new Set(eventIds)];

      let events: any[] = [];
      for (let i = 0; i < uniqueEventIds.length; i++) {
        const { data: event } = await supabase
          .from('events')
          .select(`*, venues (name)`)
          .eq('id', uniqueEventIds[i]!)
          .limit(1)
          .single();
        events.push(event);
      }

      return events;
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().nullable().optional(),
        first_name: z.string().nullable().optional(),
        last_name: z.string().nullable().optional(),
        bio: z.string().nullable().optional(),
        wallet_address: z.string().nullable().optional(),
        profile_image: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('user_profiles')
        .update(input)
        .eq('id', input.id)
        .select()
        .single();
      return data;
    }),

  isScannerForEvent: publicProcedure
    .input(z.object({ user_id: z.string(), event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('scanners')
        .select()
        .eq('user_id', input.user_id)
        .eq('event_id', input.event_id)
        .single();

      if (!data) {
        return false;
      }
      return true;
    }),

  makeScannerForEvent: authedProcedure
    .input(z.object({ user_id: z.string(), event_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('scanners')
        .insert({ user_id: input.user_id, event_id: input.event_id })
        .single();
      return data;
    }),

  getUserQRCode: authedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      if (user.id !== input.user_id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to view this user',
        });
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', input.user_id)
        .single();

      const { data: userSalt } = await supabase
        .from('user_salts')
        .select()
        .eq('user_id', input.user_id)
        .single();

      return sha256(userSalt?.salt! + userProfile?.wallet_address!).toString();
    }),
});
