import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { createStripeProduct } from '../services/stripe';

export const eventsRouter = router({
  getEvents: publicProcedure.query(async ({ ctx }) => {
    const supabase = ctx.supabase;
    const { data } = await supabase.from('events').select(`*, venues (name)`);
    return data;
  }),

  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('events')
        .select()
        .eq('id', input.id)
        .limit(1)
        .single();
      return data;
    }),

  createEvent: authedProcedure
    .input(
      z.object({
        name: z.string(),
        artist: z.string(),
        venue: z.string(),
        description: z.string(),
        date: z.date(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const stripeProduct = await createStripeProduct(input.name);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          name: input.name,
          artist: input.artist,
          venue: input.venue,
          description: input.description,
          date: input.date.toISOString(),
          created_by: ctx.user?.id!,
          stripe_product_id: stripeProduct.id,
          image: input.image ?? null,
        })
        .select()
        .limit(1)
        .single();

      return eventData;
    }),

  updateEvent: publicProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('events')
        .update(input)
        .eq('id', input.id)
        .select()
        .single();

      return data;
    }),
});
