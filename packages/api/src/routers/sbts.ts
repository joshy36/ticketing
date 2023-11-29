import { TRPCError } from '@trpc/server';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { ethers } from 'ethers';
import sbtContractAbi from '../../../../packages/chain/deployments/base-goerli/SBT.json';

export const sbtsRouter = router({
  getSbtsForUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('sbts')
        .select(`*, events (id, image, name, etherscan_link)`)
        .eq('user_id', input.user_id);
      return data;
    }),

  releaseSbtsForEvent: authedProcedure
    .input(z.object({ event_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: tickets } = await supabase
        .from('tickets')
        .select()
        .eq('event_id', input.event_id);
      const scannedTickets = tickets?.filter(
        (ticket) => ticket.scanned === true
      );

      const { data: sbts } = await supabase
        .from('sbts')
        .select()
        .eq('event_id', input.event_id);

      const link = sbts?.at(0)?.etherscan_link?.split('/');

      if (!link) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No contract deployed for sbts',
        });
      }

      const sbtsToSend = sbts?.filter(
        (sbt) => scannedTickets?.some((ticket) => ticket.id === sbt.ticket_id)
      );

      // transfer the nft and update the db
      for (let i = 0; i < sbtsToSend?.length!; i++) {
        const { data: ticket } = await supabase
          .from('tickets')
          .select()
          .eq('id', sbtsToSend![i]?.ticket_id!)
          .limit(1)
          .single();

        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', ticket?.user_id!)
          .limit(1)
          .single();

        const address = link[link.length - 1]!;
        const provider = new ethers.JsonRpcProvider(
          process.env.ALCHEMY_GOERLI_URL!
        );
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
        const eventContract = new ethers.Contract(
          address,
          sbtContractAbi.abi,
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
          `Token transferred! Check it out at: https://goerli.basescan.org/tx/${tx.hash}`
        );

        await supabase
          .from('sbts')
          .update({ user_id: ticket?.user_id })
          .eq('id', sbtsToSend![i]?.id!)
          .select();
      }
    }),
});
