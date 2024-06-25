import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';

export const pointsRouter = router({
  getArtistPointsForUser: authedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      const { data: artistPoints } = await supabase
        .from('artist_points')
        .select(`*, artists(*)`)
        .eq('user_id', input.user_id);

      return artistPoints;
    }),

  getVenuePointsForUser: authedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      const { data: venuePoints } = await supabase
        .from('venue_points')
        .select(`*, venues(*)`)
        .eq('user_id', input.user_id);

      return venuePoints;
    }),

  getPlatformPointsForUser: authedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      const { data: platformPoints } = await supabase
        .from('platform_points')
        .select()
        .eq('user_id', input.user_id)
        .single();

      return platformPoints?.points || 0;
    }),
});
