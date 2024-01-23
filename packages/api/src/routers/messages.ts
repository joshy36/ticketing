import {
  getEventsAttendedInOrg,
  getTotalEventsAttended,
} from './../shared/messages';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

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
        message: z.string(),
        event_id: z.string(),
        yourFans: z.string(),
        generalFans: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: userOrg } = await supabase
        .from('organization_members')
        .select()
        .eq('user_id', user?.id)
        .limit(1)
        .single();

      const { data: users } = await supabase.from('user_profiles').select();

      if (!users) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No users found',
        });
      }

      let yourFansIds: { user_id: string; number_of_events: number }[] = [];
      let generalFansIds: { user_id: string; number_of_events: number }[] = [];

      for (let i = 0; i < users?.length; i++) {
        const totalEvents = await getTotalEventsAttended(
          supabase,
          users[i]?.id!
        );
        const totalEventsInOrg = await getEventsAttendedInOrg(
          supabase,
          users[i]?.id!,
          userOrg?.organization_id!
        );

        if (totalEventsInOrg > 0) {
          yourFansIds.push({
            user_id: users[i]?.id!,
            number_of_events: totalEventsInOrg,
          });
        }
        generalFansIds.push({
          user_id: users[i]?.id!,
          number_of_events: totalEvents,
        });
      }

      // sort them in descending order
      yourFansIds.sort((a, b) => b.number_of_events - a.number_of_events);
      generalFansIds.sort((a, b) => b.number_of_events - a.number_of_events);

      // combine the two arrays with no duplicates so we dont send a message to the same person twice
      let combinedFansIds: string[] = [];
      for (
        let i = 0;
        i < Math.ceil(Number(input.yourFans) * yourFansIds.length);
        i++
      ) {
        if (!combinedFansIds.includes(yourFansIds[i]!.user_id)) {
          combinedFansIds.push(yourFansIds[i]!.user_id);
        }
      }
      for (
        let i = 0;
        i < Math.ceil(Number(input.generalFans) * generalFansIds.length);
        i++
      ) {
        if (!combinedFansIds.includes(generalFansIds[i]!.user_id)) {
          combinedFansIds.push(generalFansIds[i]!.user_id);
        }
      }

      for (let i = 0; i < combinedFansIds.length; i++) {
        const { error } = await supabase.from('messages').insert({
          from: userOrg?.organization_id,
          to: combinedFansIds[i],
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
