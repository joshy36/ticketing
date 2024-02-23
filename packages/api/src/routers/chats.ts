import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { Chat } from 'supabase';

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

      // get only chats for user
      const filteredChats = chats?.filter((chat) =>
        chat.chat_members.find((chatUser) => chatUser.user_id === user?.id)
      );

      const messages = [];

      // grab first 50 messages
      for (let i = 0; i < filteredChats?.length!; i++) {
        const { data: chatMessages } = await supabase
          .from('chat_messages')
          .select(`*, user_profiles(*)`)
          .eq('chat_id', filteredChats![i]!.id)
          .order('created_at', { ascending: false })
          .range(0, 50);
        messages.push(chatMessages);
      }

      return { chats: filteredChats, messagesInChats: messages };
    }),

  getMessagesByChat: authedProcedure
    .input(z.object({ chat_id: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      if (!input.chat_id) {
        return [];
      }

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

  createChat: authedProcedure
    .input(z.object({ usernames: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', user.id)
        .single();

      const chatMemberIds: string[] = [userProfile?.id!];

      for (let i = 0; i < input.usernames.length; i++) {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select()
          .eq('username', input.usernames[i]!)
          .single();

        if (!userProfile) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `User ${input.usernames[i]} not found`,
          });
        }

        if (userProfile.id === user.id) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'You cannot start a chat with yourself',
          });
        }
        chatMemberIds.push(userProfile.id);
      }

      // check if chat already exists
      const { data: chats } = await supabase
        .from('chats')
        .select(`*, chat_members(*)`);

      for (let i = 0; i < chats?.length!; i++) {
        const chat_members = chats![i]!.chat_members.map(
          (member) => member.user_id
        );
        if (areArraysEqual(chat_members, chatMemberIds)) {
          // dont create a new chat
          console.log('chat already exists');
          return chats![i]?.id;
        }
      }

      let newChat: Chat | null;

      if (chatMemberIds.length <= 2) {
        const { data: chat } = await supabase
          .from('chats')
          .insert({
            chat_type: 'dm',
          })
          .select()
          .single();
        newChat = chat;
      } else {
        const { data: chat } = await supabase
          .from('chats')
          .insert({
            chat_type: 'group',
          })
          .select()
          .single();
        newChat = chat;
      }

      for (let i = 0; i < chatMemberIds.length; i++) {
        await supabase.from('chat_members').insert({
          chat_id: newChat?.id!,
          user_id: chatMemberIds[i]!,
        });
      }

      return newChat?.id;
    }),

  readMessages: authedProcedure
    .input(z.object({ chat_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      if (input.chat_id === '') {
        console.log('no chat selected');
        return null;
      }

      const { data: messages } = await supabase
        .from('chat_messages')
        .select()
        .eq('chat_id', input.chat_id)
        .order('created_at', { ascending: false });

      if (messages && messages.length > 0) {
        const { data: lastMessage } = await supabase
          .from('chat_members')
          .update({
            last_read: messages[messages.length - 1]?.id,
          })
          .eq('user_id', user?.id)
          .eq('chat_id', input.chat_id)
          .select()
          .single();

        return lastMessage;
      }

      return null;
    }),
});

function areArraysEqual(arr1: any[], arr2: any[]) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort the arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Compare the sorted arrays element by element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}
