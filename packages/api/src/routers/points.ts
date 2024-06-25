import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';

export const pointsRouter = router({
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
