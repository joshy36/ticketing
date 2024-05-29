import { TRPCError } from '@trpc/server';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { ethers } from 'ethers';
import collectibleContractAbi from '../../../../packages/chain/deployments/base-goerli/Collectible.json';

export const collectiblesRouter = router({
  getCollectiblesForUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('collectibles')
        .select(`*, events (id, image, name)`)
        .eq('user_id', input.user_id);
      return data;
    }),

  collectiblesReleased: authedProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('events_metadata')
        .select()
        .eq('event_id', input.event_id)
        .limit(1)
        .single();

      return data?.collectibles_released;
    }),

  releaseCollectiblesForEvent: authedProcedure
    .input(z.object({ event_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: tickets } = await supabase
        .from('tickets')
        .select()
        .eq('event_id', input.event_id)
        .eq('scanned', true);

      const { data: collectibles } = await supabase
        .from('collectibles')
        .select()
        .eq('event_id', input.event_id);

      const { data: eventMetadata } = await supabase
        .from('events_metadata')
        .select()
        .eq('id', input.event_id)
        .limit(1)
        .single();

      if (!eventMetadata?.collectible_etherscan_link) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No contract deployed for collectibles',
        });
      }

      if (eventMetadata?.collectibles_released) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Collectibles already released',
        });
      }

      const link = eventMetadata.collectible_etherscan_link.split('/');

      const collectiblesToSend = collectibles?.filter((collectible) =>
        tickets?.some((ticket) => ticket.id === collectible.ticket_id)
      );

      // transfer the nft and update the db
      for (let i = 0; i < collectiblesToSend?.length!; i++) {
        const { data: ticket } = await supabase
          .from('tickets')
          .select()
          .eq('id', collectiblesToSend![i]?.ticket_id!)
          .limit(1)
          .single();

        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', ticket?.owner_id!)
          .limit(1)
          .single();

        const address = link[link.length - 1]!;
        const provider = new ethers.JsonRpcProvider(
          process.env.ALCHEMY_SEPOLIA_URL!
        );
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
        const eventContract = new ethers.Contract(
          address,
          collectibleContractAbi.abi,
          signer
        );
        // @ts-ignore
        let tx = await eventContract.safeTransferFrom(
          signer.address,
          userProfile?.wallet_address,
          ticket?.token_id
        );
        console.log('tx: ', tx);
        await tx.wait();
        console.log(
          `Token transferred! Check it out at: https://base-sepolia.blockscout.com/tx/${tx.hash}`
        );

        await supabase
          .from('collectibles')
          .update({ user_id: ticket?.owner_id })
          .eq('id', collectiblesToSend![i]?.id!)
          .select();
      }

      await supabase
        .from('events_metadata')
        .update({ collectibles_released: true })
        .eq('id', input.event_id);
    }),
});
