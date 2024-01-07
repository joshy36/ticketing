import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { UserProfile } from 'supabase';

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
        .from('organization_members')
        .select()
        .eq('user_id', input.user_id)
        .limit(1)
        .single();

      return data?.organization_id;
    }),

  getOrganizationMembers: authedProcedure
    .input(z.object({ organization_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: members } = await supabase
        .from('organization_members')
        .select()
        .eq('organization_id', input.organization_id);

      if (!members) return null;

      type Member = {
        created_at: string;
        id: string;
        organization_id: string | null;
        role: 'owner' | 'admin' | null;
        updated_at: string | null;
        user_id: string | null;
        profile: UserProfile;
      };

      let memberProfiles: Member[] = [];

      for (let i = 0; i < members?.length!; i++) {
        const { data: memberProfile } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', members[i]!.user_id!)
          .limit(1)
          .single();

        memberProfiles.push({
          ...members[i]!,
          profile: memberProfile!,
        });
      }

      return memberProfiles;
    }),

  addUserToOrganization: authedProcedure
    .input(z.object({ username: z.string(), organization_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: user } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .limit(1)
        .single();

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .limit(1)
        .single();

      const { data: userOrg } = await supabase
        .from('organization_members')
        .select()
        .eq('user_id', userProfile?.id!)
        .limit(1)
        .single();

      if (userOrg) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User is already in an organization',
        });
      }

      const { data } = await supabase
        .from('organization_members')
        .insert({
          organization_id: input.organization_id,
          user_id: user.id,
          role: 'admin',
        })
        .select();

      return data;
    }),

  updateOrganizationName: authedProcedure
    .input(z.object({ organization_id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: isUserInOrg } = await supabase
        .from('organization_members')
        .select()
        .eq('user_id', user?.id)
        .eq('organization_id', input.organization_id)
        .limit(1)
        .single();

      if (!isUserInOrg) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User is not in this organization',
        });
      }

      const { data: newName } = await supabase
        .from('organizations')
        .update({ name: input.name })
        .eq('id', input.organization_id)
        .select('name');

      return newName;
    }),
});
