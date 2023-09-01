import createRouteClient from '@/lib/supabaseRoute';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  getEvents: publicProcedure.query(async () => {
    const supabase = createRouteClient();
    const { data } = await supabase.from('events').select();
    return data;
  }),
  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = createRouteClient();
      const { data } = await supabase
        .from('events')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),
  getUserProfile: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async (opts) => {
      const supabase = createRouteClient();
      const { data } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),
  createEvent: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        location: z.string(),
        image: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const supabase = createRouteClient();
      const { data } = await supabase
        .from('events')
        .insert({
          name: opts.input.name,
          description: opts.input.description,
          date: opts.input.date,
          location: opts.input.location,
          image: opts.input.image ?? null,
        })
        .select()
        .limit(1)
        .single();
      return data;
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        bio: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const supabase = createRouteClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          username: opts.input.username,
          first_name: opts.input.first_name,
          last_name: opts.input.last_name,
          bio: opts.input.bio,
        })
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
});

export type AppRouter = typeof appRouter;
