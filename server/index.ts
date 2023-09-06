import createRouteClient from '@/lib/supabaseRoute';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const appRouter = router({
  getEvents: publicProcedure.query(async () => {
    const supabase = createRouteClient();
    const { data } = await supabase.from('events').select();
    return data;
  }),
  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = createRouteClient();
      const { data } = await supabase
        .from('events')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),
  getUserProfile: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async (opts) => {
      const supabase = createRouteClient();
      const { data } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),
  createEvent: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        number_of_tickets: z.number(),
        date: z.string(),
        location: z.string(),
        image: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const supabase = createRouteClient();
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          name: opts.input.name,
          description: opts.input.description,
          number_of_tickets: opts.input.number_of_tickets,
          tickets_remaining: opts.input.number_of_tickets,
          date: opts.input.date,
          location: opts.input.location,
          image: opts.input.image ?? null,
        })
        .select()
        .limit(1)
        .single();
      console.log(eventError);

      const tickets = Array(opts.input.number_of_tickets).fill({
        event_id: eventData?.id,
        price: 0,
      });
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert(tickets);
      console.log(ticketData);
      console.log(ticketError);

      return eventData;
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        bio: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const supabase = createRouteClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          username: opts.input.username,
          first_name: opts.input.first_name,
          last_name: opts.input.last_name,
          bio: opts.input.bio,
        })
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
  updateUserImage: publicProcedure
    .input(
      z.object({
        id: z.string(),
        profile_image: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const supabase = createRouteClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          profile_image: opts.input.profile_image,
        })
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
  getTicketsForUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async (opts) => {
      const supabase = createRouteClient();
      const { data } = await supabase
        .from('tickets')
        .select(`*, events (image, name)`)
        .eq('user_id', opts.input.user_id);
      return data;
    }),
  transferTicket: publicProcedure
    .input(
      z.object({ seat: z.string(), event_id: z.string(), user_id: z.string() })
    )
    .mutation(async (opts) => {
      const supabase = createRouteClient();
      const { data: getTicket, error: getTicketError } = await supabase
        .from('tickets')
        .select()
        .eq('seat', opts.input.seat)
        .eq('event_id', opts.input.event_id)
        .is('user_id', null)
        .limit(1)
        .single();

      console.log(getTicket);
      console.log(getTicketError);
      if (getTicketError?.code == 'PGRST116') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          // optional: pass the original error to retain stack trace
          cause: getTicketError,
        });
      }
      const { data: transferTicket, error: transferTicketError } =
        await supabase
          .from('tickets')
          .update({ user_id: opts.input.user_id })
          .eq('id', getTicket?.id)
          .select()
          .single();

      await supabase.rpc('increment', {
        table_name: 'events',
        row_id: opts.input.event_id,
        x: -1,
        field_name: 'tickets_remaining',
      });

      return transferTicket;
    }),
});

export type AppRouter = typeof appRouter;
