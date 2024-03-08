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
      let newChat: string = '';
      let fromChatMembers;

      for (let i = 0; i < combinedFansIds.length; i++) {
        chatExists = false;
        for (let j = 0; j < chats?.length!; j++) {
          const chat_members = chats!
            [j]!.chat_members.map(
              (member) => member.artist_id || member.venue_id || member.user_id
            )
            .filter((member) => member !== null);
          console.log('chat_members', chat_members);
          console.log('test_members', combinedFansIds[i], input.from);
          if (areArraysEqual(chat_members, [combinedFansIds[i], input.from])) {
            // dont create a new chat
            console.log('chat already exists');
            chatExists = true;
            newChat = chats?.[j]!.id!;
            const { data: isArtist } = await supabase
              .from('chat_members')
              .select()
              .eq('chat_id', newChat)
              .eq('artist_id', input.from)
              .single();
            if (isArtist) {
              fromChatMembers = isArtist;
            }
            const { data: isVenue } = await supabase
              .from('chat_members')
              .select()
              .eq('chat_id', newChat)
              .eq('venue_id', input.from)
              .single();
            if (isVenue) {
              fromChatMembers = isVenue;
            }
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
          newChat = chat?.id!;

          await supabase.from('chat_members').insert({
            chat_id: newChat,
            user_id: combinedFansIds[i]!,
          });

          if (input.fromType === 'artist') {
            const { data } = await supabase
              .from('chat_members')
              .insert({
                chat_id: newChat,
                artist_id: input.from,
              })
              .select()
              .single();
            fromChatMembers = data;
          } else if (input.fromType === 'venue') {
            const { data } = await supabase
              .from('chat_members')
              .insert({
                chat_id: newChat,
                venue_id: input.from,
              })
              .select()
              .single();
            fromChatMembers = data;
          }
        }

        const { data: newMessage, error } = await supabase
          .from('chat_messages')
          .insert({
            chat_id: newChat,
            from: fromChatMembers?.id,
            content: input.message,
            event_id: input.event_id,
          })
          .select()
          .single();

        if (error) {
          return error;
        }

        await supabase.from('chat_member_messages').insert({
          chat_member_id: fromChatMembers?.id,
          chat_message_id: newMessage?.id,
          chat_id: newChat,
        });
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
