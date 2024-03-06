import {
  areArraysEqual,
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

  getMessageById: authedProcedure
    .input(z.object({ message_id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log('hit');
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('messages')
        .select()
        .eq('id', input.message_id)
        .limit(1)
        .single();

      console.log(data);

      return data;
    }),

  sendMessage: authedProcedure
    .input(
      z.object({
        message: z.string(),
        from: z.string(),
        fromType: z.enum(['artist', 'venue']),
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

      // check if chat already exists
      const { data: chats } = await supabase
        .from('chats')
        .select(`*, chat_members(*)`);

      let chatExists = false;

      for (let i = 0; i < combinedFansIds.length; i++) {
        chatExists = false;
        for (let j = 0; j < chats?.length!; j++) {
          const chat_members = chats![j]!.chat_members.map(
            (member) => member.user_id
          );
          console.log('chat_members: ', chat_members);
          console.log('combinedFansIds: ', combinedFansIds[i], input.from);
          if (areArraysEqual(chat_members, [combinedFansIds[i], input.from])) {
            // dont create a new chat
            console.log('chat already exists');
            chatExists = true;
          } else {
            // dont do anything
          }
        }
        if (!chatExists) {
          const { data: chat } = await supabase
            .from('chats')
            .insert({
              chat_type: 'organization',
            })
            .select()
            .single();

          // (1) find out why its making multiple chats done
          // (2) actually send the message
          // (3) make sure db changes havent effected frontend for other chats
          // (4) why arent messages showing up for venue
          // (5) revisit (1)
          // (6) clean up db

          await supabase.from('chat_members').insert({
            chat_id: chat?.id!,
            user_id: combinedFansIds[i]!,
          });

          let fromChatMembers;

          if (input.fromType === 'artist') {
            const { data } = await supabase
              .from('chat_members')
              .insert({
                chat_id: chat?.id!,
                artist_id: input.from,
              })
              .select()
              .single();
            fromChatMembers = data;
          } else if (input.fromType === 'venue') {
            const { data } = await supabase
              .from('chat_members')
              .insert({
                chat_id: chat?.id!,
                venue_id: input.from,
              })
              .select()
              .single();
            fromChatMembers = data;
          }

          console.log('members2: ', fromChatMembers);

          const { data: newMessage, error } = await supabase
            .from('chat_messages')
            .insert({
              chat_id: chat?.id!,
              from: fromChatMembers?.id,
              content: input.message,
              event_id: input.event_id,
            })
            .select()
            .single();
          console.log('error', error);
          if (error) {
            return error;
          }
          console.log('newMessage: ', newMessage);
          const { data: test, error: testerror } = await supabase
            .from('chat_member_messages')
            .insert({
              chat_member_id: fromChatMembers?.id,
              chat_message_id: newMessage?.id,
              chat_id: chat?.id,
            });
          console.log('done', test, testerror);
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
