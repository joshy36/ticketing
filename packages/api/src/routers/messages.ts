import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';

export const messagesRouter = router({
  getMessagesForUser: authedProcedure.query(async ({ ctx, input }) => {
    const supabase = ctx.supabase;
    const user = ctx.user;
    const { data } = await supabase
      .from('messages')
      .select()
      .eq('to', user?.id);

    return data;
  }),

  sendMessage: authedProcedure
    .input(
      z.object({
        to: z.array(z.string()),
        message: z.string(),
        event_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;
      const { data: from } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', user?.id)
        .limit(1)
        .single();

      const { data: userOrg } = await supabase
        .from('organization_members')
        .select()
        .eq('user_id', user?.id)
        .limit(1)
        .single();

      for (let i = 0; i < input.to.length; i++) {
        const { error } = await supabase.from('messages').insert({
          from: userOrg?.organization_id,
          to: input.to[i],
          message: input.message,
          event_id: input.event_id,
        });
        if (error) {
          return error;
        }
      }
    }),

  setMessageRead: authedProcedure
    .input(z.object({ message_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      await supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('id', input.message_id);
    }),

  deleteMessage: authedProcedure
    .input(z.object({ message_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      await supabase
        .from('messages')
        .update({ status: 'deleted' })
        .eq('id', input.message_id);
    }),
});
