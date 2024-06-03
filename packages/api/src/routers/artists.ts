import { TRPCError } from '@trpc/server';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';

export const artistsRouter = router({
  getArtists: publicProcedure.query(async ({ ctx }) => {
    const supabase = ctx.supabase;
    const { data } = await supabase.from('artists').select();
    return data;
  }),

  getArtistById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('artists')
        .select()
        .eq('id', input.id)
        .limit(1)
        .single();
      return data;
    }),

  getArtistsByOrganization: authedProcedure
    .input(z.object({ organization_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      const { data: artists } = await supabase
        .from('artists')
        .select('*')
        .eq('organization_id', input.organization_id);

      return artists;
    }),

  createArtist: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        organization_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data, error } = await supabase
        .from('artists')
        .insert({
          created_by: ctx.user?.id,
          name: input.name,
          description: input.description,
          organization_id: input.organization_id,
        })
        .select()
        .limit(1)
        .single();

      if (error?.code === '23505') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Artist name already exists, please choose another name.',
        });
      }

      return data;
    }),

  updateArtist: authedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('artists')
        .update(input)
        .eq('id', input.id)
        .select()
        .single();

      return data;
    }),
});
