import { TRPCError } from '@trpc/server';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';

export const venuesRouter = router({
  getVenues: publicProcedure.query(async ({ ctx, input }) => {
    const supabase = ctx.supabase;
    const { data } = await supabase.from('venues').select();
    return data;
  }),

  getVenueById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('venues')
        .select()
        .eq('id', input.id)
        .limit(1)
        .single();
      return data;
    }),

  getSectionsForVenue: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: sections } = await supabase
        .from('sections')
        .select()
        .eq('venue_id', input.id);

      return sections;
    }),

  getSectionsForVenueWithPrices: publicProcedure
    .input(z.object({ id: z.string(), event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: sections } = await supabase
        .from('sections')
        .select()
        .eq('venue_id', input.id);

      let sectionsWithPrices = [];

      for (let i = 0; i < sections?.length!; i++) {
        const { data: ticketPrice } = await supabase
          .from('tickets')
          .select('price')
          .eq('section_id', sections![i]?.id!)
          .eq('event_id', input.event_id)
          .limit(1)
          .single();

        sectionsWithPrices.push({
          ...sections![i]!,
          price: ticketPrice?.price,
        });
      }

      return sectionsWithPrices;
    }),

  createVenue: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        sections: z.array(z.object({ value: z.string() })),
        rows: z.array(z.object({ value: z.number() })),
        seats_per_row: z.array(z.object({ value: z.number() })),
        organization_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: venue, error: venueCreateError } = await supabase
        .from('venues')
        .insert({
          created_by: ctx.user?.id,
          name: input.name,
          description: input.description,
          organization_id: input.organization_id,
        })
        .select()
        .limit(1)
        .single();

      if (venueCreateError?.code === '23505') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Venue name already exists, please choose another name.',
        });
      }

      for (let i = 0; i < input.sections.length; i++) {
        const seats =
          input.rows[i]?.value === 0 ? input.seats_per_row[i]?.value : null;
        const { data: section } = await supabase
          .from('sections')
          .insert({
            name: input.sections[i]?.value,
            venue_id: venue?.id,
            seats_per_row: input.seats_per_row[i]?.value,
            number_of_rows: input.rows[i]?.value,
          })
          .select()
          .limit(1)
          .single();

        for (let j = 0; j < input.rows[i]?.value!; j++) {
          await supabase
            .from('rows')
            .insert({
              name: String(j + 1),
              section_id: section?.id,
              number_of_seats: input.seats_per_row[i]?.value,
            })
            .select()
            .limit(1)
            .single();
        }
      }

      return venue;
    }),

  updateVenue: authedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('venues')
        .update(input)
        .eq('id', input.id)
        .select()
        .single();

      return data;
    }),
});
