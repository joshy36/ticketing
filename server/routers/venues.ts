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

  createVenue: authedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;

      const { data } = await supabase
        .from('venues')
        .insert({
          created_by: opts.ctx.user?.id,
          name: opts.input.name,
          description: opts.input.description,
        })
        .select()
        .limit(1)
        .single();

      return data;
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
