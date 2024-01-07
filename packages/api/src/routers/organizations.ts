import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const organizationsRouter = router({
  getOrganizationById: publicProcedure
    .input(z.object({ organization_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('organizations')
        .select()
        .eq('id', input.organization_id)
        .limit(1)
        .single();

      return data;
    }),

  getUserOrganization: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', input.user_id)
        .limit(1)
        .single();

      return data?.organization_id;
    }),

  getOrganizationMembers: authedProcedure
    .input(z.object({ organization_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('user_profiles')
        .select()
        .eq('organization_id', input.organization_id);

      return data;
    }),

  addUserToOrganization: authedProcedure
    .input(z.object({ username: z.string(), organization_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('user_profiles')
        .update({ organization_id: input.organization_id })
        .eq('username', input.username);

      return data;
    }),
});
