import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { ethers } from 'ethers';
import contractAbi from '@/chain/deployments/base-goerli/Event.json';
import { TRPCError } from '@trpc/server';

export const ticketsRouter = router({
  getTicketById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('tickets')
        .select(`*, events (image, name)`)
        .eq('id', opts.input.id);

      if (data?.length === 0) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          // optional: pass the original error to retain stack trace
          cause: 'No ticket with inputted id',
        });
      } else {
        return data![0];
      }
    }),

  getTicketsForUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('tickets')
        .select(`*, events (id, image, name, etherscan_link)`)
        .eq('user_id', opts.input.user_id);
      return data;
    }),

  getTicketsForEvent: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('tickets')
        .select(`*`)
        .eq('event_id', opts.input.event_id)
        .order('price', { ascending: true });
      return data;
    }),

  sellTicket: publicProcedure
    .input(
      z.object({
        ticket_id: z.string(),
        event_id: z.string(),
        user_id: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data: eventData } = await supabase
        .from('events')
        .select()
        .eq('id', opts.input.event_id)
        .limit(1)
        .single();

      const { data: getTicket, error: getTicketError } = await supabase
        .from('tickets')
        .select()
        .eq('id', opts.input.ticket_id)
        .limit(1)
        .single();

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', opts.input.user_id)
        .limit(1)
        .single();

      if (getTicketError?.code == 'PGRST116') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          // optional: pass the original error to retain stack trace
          cause: getTicketError,
        });
      }

      const link = eventData?.etherscan_link?.split('/');
      if (!link) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          cause: 'No etherscan link',
        });
      }

      const address = link[link.length - 1]!;

      const provider = new ethers.JsonRpcProvider(
        process.env.ALCHEMY_GOERLI_URL!,
      );

      const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
      const eventContract = new ethers.Contract(
        address,
        contractAbi.abi,
        signer,
      );

      // @ts-ignore
      let tx = await eventContract.safeTransferFrom(
        signer.address,
        userProfile?.wallet_address,
        getTicket?.token_id,
      );
      await tx.wait();
      console.log(
        `Token transferred! Check it out at: https://goerli.basescan.org/tx/${tx.hash}`,
      );

      const { data: transferTicket, error: transferTicketError } =
        await supabase
          .from('tickets')
          .update({ user_id: opts.input.user_id })
          .eq('id', getTicket?.id!)
          .select()
          .single();

      await supabase.rpc('increment', {
        table_name: 'events',
        row_id: opts.input.event_id,
        x: -1,
        field_name: 'tickets_remaining',
      });

      return transferTicket;
    }),
});
