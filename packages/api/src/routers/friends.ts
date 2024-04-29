import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { UserProfile } from 'supabase';

export const friendsRouter = router({
  getFriendshipStatus: publicProcedure
    .input(
      z.object({ currentUserId: z.string().optional(), otherUser: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      if (!input.currentUserId) {
        return 'none';
      }

      const { data: otherUserProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.otherUser)
        .single();

      const { data: friends } = await supabase
        .from('friends')
        .select()
        .eq('user1_id', input.currentUserId)
        .eq('user2_id', otherUserProfile?.id!)
        .limit(1)
        .single();

      if (friends) {
        return 'accepted';
      } else {
        const { data: friends2 } = await supabase
          .from('friends')
          .select()
          .eq('user1_id', otherUserProfile?.id!)
          .eq('user2_id', input.currentUserId)
          .limit(1)
          .single();

        if (friends2) {
          return 'accepted';
        } else {
          const { data: friendRequests } = await supabase
            .from('friend_requests')
            .select()
            .eq('from', input.currentUserId)
            .eq('to', otherUserProfile?.id!)
            .limit(1)
            .single();

          if (friendRequests?.status === 'pending') {
            return 'requested';
          } else if (friendRequests?.status === 'rejected') {
            return 'rejected';
          }
        }
      }
      return 'none';
    }),

  getPendingFriendRequestsForUser: authedProcedure.query(
    async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: friendRequests } = await supabase
        .from('friend_requests')
        .select(`*, from:user_profiles!friend_requests_from_fkey(*)`)
        .eq('to', user?.id)
        .eq('status', 'pending');

      return friendRequests;
    }
  ),

  getTotalFriendsCountForUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      let friendsCount = 0;

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .single();

      const { data: friends } = await supabase
        .from('friends')
        .select()
        .eq('user1_id', userProfile?.id!);

      console.log('friends: ', friends);

      if (friends) {
        friendsCount += friends.length;
      }

      const { data: friends2 } = await supabase
        .from('friends')
        .select()
        .eq('user2_id', userProfile?.id!);

      console.log('friends2: ', friends2);

      if (friends2) {
        friendsCount += friends2.length;
      }

      return friendsCount;
    }),

  getTotalFriendsForUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      let totalFriends: UserProfile[] = [];

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .single();

      const { data: friends } = await supabase
        .from('friends')
        .select(`*, friend_profile:user_profiles!friends_user2_id_fkey(*)`)
        .eq('user1_id', userProfile?.id!);

      if (friends) {
        const friendProfiles = friends.map((f) => f.friend_profile!);
        totalFriends.push(...friendProfiles);
      }

      const { data: friends2 } = await supabase
        .from('friends')
        .select(`*, friend_profile:user_profiles!friends_user1_id_fkey(*)`)
        .eq('user2_id', userProfile?.id!);

      if (friends2) {
        const friendProfiles2 = friends2.map((f) => f.friend_profile!);
        totalFriends.push(...friendProfiles2);
      }

      return totalFriends;
    }),

  requestFriend: authedProcedure
    .input(z.object({ to: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      await supabase.from('friend_requests').insert({
        from: user?.id,
        to: input.to,
      });
    }),

  rejectFriendRequest: authedProcedure
    .input(z.object({ from: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('from', input.from)
        .eq('to', user?.id);
    }),

  acceptFriendRequest: authedProcedure
    .input(z.object({ from: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('from', input.from)
        .eq('to', user?.id);

      await supabase.from('friends').insert({
        user1_id: user?.id,
        user2_id: input.from,
      });
    }),
});
