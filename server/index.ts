import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ethers } from 'ethers';
import contractAbi from '@/chain/deployments/base-goerli/Event.json';

export const appRouter = router({
  getEvents: publicProcedure.query(async (opts) => {
    const supabase = opts.ctx.supabase;
    const { data } = await supabase.from('events').select();
    return data;
  }),

  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('events')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),

  getUserProfile: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),

  createEvent: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        ga_tickets: z.number(),
        ga_price: z.number(),
        rows: z.number().optional(),
        seats_per_row: z.number().optional(),
        date: z.string(),
        location: z.string(),
        image: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;

      let ticketsRemaining = opts.input.ga_tickets;
      if (
        opts.input.rows &&
        opts.input.rows > 0 &&
        opts.input.seats_per_row &&
        opts.input.seats_per_row > 0
      ) {
        ticketsRemaining += opts.input.rows * opts.input.seats_per_row;
      }

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          name: opts.input.name,
          description: opts.input.description,
          ga_tickets: opts.input.ga_tickets,
          ga_price: opts.input.ga_price,
          rows: opts.input.rows,
          seats_per_row: opts.input.seats_per_row,
          tickets_remaining: ticketsRemaining,
          date: opts.input.date,
          location: opts.input.location,
          image: opts.input.image ?? null,
        })
        .select()
        .limit(1)
        .single();

      const tickets = Array(opts.input.ga_tickets).fill({
        event_id: eventData?.id,
        price: opts.input.ga_price,
        seat: 'GA',
      });

      if (opts.input.rows && opts.input.seats_per_row) {
        const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let row = 1; row <= opts.input.rows; row++) {
          for (let seat = 0; seat < opts.input.seats_per_row; seat++) {
            tickets.push({
              event_id: eventData?.id,
              price: opts.input.ga_price,
              seat: String(row) + names[seat],
            });
          }
        }
      }

      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert(tickets);

      return eventData;
    }),

  updateEvent: publicProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('events')
        .update(opts.input)
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().nullable().optional(),
        first_name: z.string().nullable().optional(),
        last_name: z.string().nullable().optional(),
        bio: z.string().nullable().optional(),
        wallet_address: z.string().nullable().optional(),
        profile_image: z.string().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data, error } = await supabase
        .from('user_profiles')
        .update(opts.input)
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),

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
      })
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
        process.env.ALCHEMY_GOERLI_URL!
      );

      const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
      const eventContract = new ethers.Contract(
        address,
        contractAbi.abi,
        signer
      );

      // @ts-ignore
      let tx = await eventContract.safeTransferFrom(
        signer.address,
        userProfile?.wallet_address,
        getTicket?.token_id
      );
      await tx.wait();
      console.log(
        `Token transferred! Check it out at: https://goerli.basescan.org/tx/${tx.hash}`
      );

      const { data: transferTicket, error: transferTicketError } =
        await supabase
          .from('tickets')
          .update({ user_id: opts.input.user_id })
          .eq('id', getTicket?.id)
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

  getArtists: publicProcedure.query(async (opts) => {
    const supabase = opts.ctx.supabase;
    const { data } = await supabase.from('artists').select();
    return data;
  }),

  getArtistById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('artists')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),

  createArtist: privateProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;

      const { data } = await supabase
        .from('artists')
        .insert({
          created_by: opts.ctx.user?.id,
          name: opts.input.name,
          description: opts.input.description,
        })
        .select()
        .limit(1)
        .single();

      return data;
    }),

  updateArtist: privateProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('artists')
        .update(opts.input)
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
});

export type AppRouter = typeof appRouter;
