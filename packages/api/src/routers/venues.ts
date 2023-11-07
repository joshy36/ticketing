import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';

export const venuesRouter = router({
  getVenues: publicProcedure.query(async (opts) => {
    const supabase = opts.ctx.supabase;
    const { data } = await supabase.from('venues').select();
    return data;
  }),

  getVenueById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('venues')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),

  getSectionsForVenue: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('sections')
        .select()
        .eq('venue_id', opts.input.id);

      return data;
    }),

  createVenue: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        sections: z.array(z.object({ value: z.string() })),
        rows: z.array(z.object({ value: z.number() })),
        seats_per_row: z.array(z.object({ value: z.number() })),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;

      const { data: venue } = await supabase
        .from('venues')
        .insert({
          created_by: opts.ctx.user?.id,
          name: opts.input.name,
          description: opts.input.description,
        })
        .select()
        .limit(1)
        .single();

      for (let i = 0; i < opts.input.sections.length; i++) {
        const seats =
          opts.input.rows[i]?.value === 0
            ? opts.input.seats_per_row[i]?.value
            : null;
        const { data: section } = await supabase
          .from('sections')
          .insert({
            name: opts.input.sections[i]?.value,
            venue_id: venue?.id,
            seats_per_row: opts.input.seats_per_row[i]?.value,
            number_of_rows: opts.input.rows[i]?.value,
          })
          .select()
          .limit(1)
          .single();

        for (let j = 0; j < opts.input.rows[i]?.value!; j++) {
          await supabase
            .from('rows')
            .insert({
              name: String(j + 1),
              section_id: section?.id,
              number_of_seats: opts.input.seats_per_row[i]?.value,
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
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('venues')
        .update(opts.input)
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
});
