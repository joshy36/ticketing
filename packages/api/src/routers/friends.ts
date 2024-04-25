import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';

export const friendsRouter = router({
  getFriendshipStatus: publicProcedure
    .input(z.object({ otherUser: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: otherUserProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.otherUser)
        .single();

      const { data: friends } = await supabase
        .from('friends')
        .select()
        .eq('user1_id', user?.id)
        .eq('user2_id', otherUserProfile?.id!)
        .limit(1)
        .single();

      console.log(friends);

      if (friends) {
        return 'accepted';
      } else {
        const { data: friends2 } = await supabase
          .from('friends')
          .select()
          .eq('user1_id', otherUserProfile?.id!)
          .eq('user2_id', user?.id)
          .limit(1)
          .single();

        console.log(friends2);

        if (friends2) {
          return 'accepted';
        } else {
          const { data: friendRequests } = await supabase
            .from('friend_requests')
            .select()
            .eq('from', user?.id)
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

  getTotalFriendsForUser: authedProcedure.query(async ({ ctx }) => {
    const supabase = ctx.supabase;
    const user = ctx.user;

    let friendsCount = 0;

    const { data: friends } = await supabase
      .from('friends')
      .select()
      .eq('user1_id', user?.id);

    if (friends) {
      friendsCount += friends.length;
    }

    const { data: friends2 } = await supabase
      .from('friends')
      .select()
      .eq('user2_id', user?.id);

    if (friends2) {
      friendsCount += friends2.length;
    }

    return friendsCount;
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
    .mutation(async ({ ctx, input }) => {}),
});
