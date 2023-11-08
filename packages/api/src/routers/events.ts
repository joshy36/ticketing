import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { createStripeProduct } from '../services/stripe';

export const eventsRouter = router({
  getEvents: publicProcedure.query(async (opts) => {
    const supabase = opts.ctx.supabase;
    const { data } = await supabase.from('events').select(`*, venues (name)`);

    return data;
  }),

  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('events')
        .select()
        .eq('id', opts.input.id)
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
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;

      const stripeProduct = await createStripeProduct(opts.input.name);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          name: opts.input.name,
          artist: opts.input.artist,
          venue: opts.input.venue,
          description: opts.input.description,
          date: opts.input.date.toISOString(),
          created_by: opts.ctx.user?.id!,
          stripe_product_id: stripeProduct.id,
          image: opts.input.image ?? null,
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
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('events')
        .update(opts.input)
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
});
