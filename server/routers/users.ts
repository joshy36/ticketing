import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const usersRouter = router({
  getUserProfile: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
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
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data, error } = await supabase
        .from('user_profiles')
        .update(opts.input)
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
});
