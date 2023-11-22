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

  getSectionPriceByEvent: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: event } = await supabase
        .from('events')
        .select()
        .eq('id', input.event_id)
        .limit(1)
        .single();
      const { data: venue } = await supabase
        .from('venues')
        .select()
        .eq('id', event?.venue!)
        .limit(1)
        .single();
      const { data: sections } = await supabase
        .from('sections')
        .select()
        .eq('venue_id', venue?.id!);
      let sectionPrices: {
        section_id: string;
        section_name: string | null;
        price: number;
      }[] = [];
      for (let i = 0; i < sections!.length; i++) {
        const { data: ticket } = await supabase
          .from('tickets')
          .select()
          .eq('section_id', sections![i]?.id!)
          .limit(1)
          .single();
        sectionPrices.push({
          section_id: sections![i]?.id!,
          section_name: sections![i]?.name!,
          price: ticket?.price!,
        });
      }
      return sectionPrices;
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
