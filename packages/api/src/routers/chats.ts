import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const chatsRouter = router({
  getUserChats: authedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;
      if (input.user_id !== user?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to view this user',
        });
      }

      const { data: chats } = await supabase
        .from('chats')
        .select(`*, chat_members(*, user_profiles(*))`);

      return chats;
    }),

  getMessagesByChat: authedProcedure
    .input(z.object({ chat_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: chat } = await supabase
        .from('chats')
        .select(`*, chat_members(*)`)
        .eq('id', input.chat_id)
        .limit(1)
        .single();

      if (
        !chat?.chat_members?.find((chatUser) => chatUser.user_id === user?.id)
      ) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to view this chat',
        });
      }

      const { data: messages } = await supabase
        .from('chat_messages')
        .select(`*, user_profiles(*)`)
        .eq('chat_id', input.chat_id)
        .order('created_at', { ascending: true });

      return messages;
    }),

  sendChatMessage: authedProcedure
    .input(z.object({ chat_id: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: isUserInChat } = await supabase
        .from('chat_members')
        .select()
        .eq('user_id', user?.id)
        .eq('chat_id', input.chat_id);

      if (!isUserInChat || isUserInChat.length === 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to send a message to this chat',
        });
      }

      const { data: newMessage } = await supabase.from('chat_messages').insert({
        chat_id: input.chat_id,
        content: input.content,
        from: user?.id,
      });

      return newMessage;
    }),
});
