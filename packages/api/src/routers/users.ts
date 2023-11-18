import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const usersRouter = router({
  getUserProfile: publicProcedure
    .input(
      z.object({ id: z.string().optional(), username: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      if (input.id) {
        const { data } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', input.id)
          .limit(1)
          .single();
        return data;
      } else if (input.username) {
        const { data } = await supabase
          .from('user_profiles')
          .select()
          .eq('username', input.username)
          .limit(1)
          .single();
        return data;
      }
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().nullable().optional(),
        first_name: z.string().nullable().optional(),
        last_name: z.string().nullable().optional(),
        bio: z.string().nullable().optional(),
        wallet_address: z.string().nullable().optional(),
        profile_image: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('user_profiles')
        .update(input)
        .eq('id', input.id)
        .select()
        .single();
      return data;
    }),

  isScannerForEvent: publicProcedure
    .input(z.object({ user_id: z.string(), event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('scanners')
        .select()
        .eq('user_id', input.user_id)
        .eq('event_id', input.event_id)
        .single();

      if (!data) {
        return false;
      }
      return true;
    }),
});
