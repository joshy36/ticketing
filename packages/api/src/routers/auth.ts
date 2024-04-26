import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { revalidatePath } from 'next/cache';

export const authRouter = router({
  signIn: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error?.message == 'Invalid login credentials') {
        return { error };
      }

      revalidatePath('/', 'layout');
    }),

  signOut: publicProcedure.mutation(async ({ ctx }) => {
    const supabase = ctx.supabase;
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
  }),
});
