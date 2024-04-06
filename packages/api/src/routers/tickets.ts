import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createStripePrice } from '../services/stripe';
import { ethers } from 'ethers';
import contractAbi from '../../../../packages/chain/deployments/base-goerli/Event.json';
import { UserProfile } from 'supabase';
import sha256 from 'crypto-js/sha256';

export const ticketsRouter = router({
  // probably need to seperate into public and authed procedure for available and owned tickets
  getTicketById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data, error } = await supabase
        .from('tickets')
        .select(`*, events (image, name, date)`)
        .eq('id', input.id);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No ticket with inputted id!',
        });
      } else {
        return data![0];
      }
    }),

  getTicketsForUserByEvent: publicProcedure
    .input(z.object({ event_id: z.string(), user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('tickets')
        .select(`*, events (id, image, name, etherscan_link, date)`)
        .eq('purchaser_id', input.user_id)
        .eq('event_id', input.event_id)
        .order('id', { ascending: true });

      const { data: ownedTicket } = await supabase
        .from('tickets')
        .select(`*, events (id, image, name, etherscan_link, date)`)
        .eq('owner_id', input.user_id)
        .eq('event_id', input.event_id)
        .single();

      const ownerProfiles: UserProfile[] = [];
      for (let i = 0; i < data?.length!; i++) {
        const { data: ownerProfile } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', data![i]?.owner_id!)
          .limit(1)
          .single();
        ownerProfiles.push(ownerProfile!);
      }
      return {
        tickets: data,
        ownedTicket: ownedTicket,
        ownerProfiles: ownerProfiles,
      };
    }),

  getTicketsForUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('tickets')
        .select(`*, events (id, image, name, etherscan_link, date)`)
        .eq('purchaser_id', input.user_id)
        .order('id', { ascending: true });

      const { data: ownedTicket } = await supabase
        .from('tickets')
        .select(`*, events (id, image, name, etherscan_link, date)`)
        .eq('owner_id', input.user_id)
        .single();

      const ownerProfiles: UserProfile[] = [];
      for (let i = 0; i < data?.length!; i++) {
        const { data: ownerProfile } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', data![i]?.owner_id!)
          .limit(1)
          .single();
        ownerProfiles.push(ownerProfile!);
      }
      return {
        tickets: data,
        ownedTicket: ownedTicket,
        ownerProfiles: ownerProfiles,
      };
    }),

  getTicketsForEvent: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('tickets')
        .select(`*`)
        .eq('event_id', input.event_id)
        .order('price', { ascending: true });
      return data;
    }),

  getAvailableTicketsForEvent: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: tickets } = await supabase
        .from('tickets')
        .select(`*, reservations (id), sections (name)`)
        .eq('event_id', input.event_id)
        .is('purchaser_id', null)
        .is('owner_id', null)
        .order('price', { ascending: true });

      const noReservationTickets = tickets?.filter(
        (ticket) => ticket.reservations === null
      );

      return noReservationTickets;
    }),

  getUsersWithoutTicketsForEvent: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: tickets } = await supabase
        .from('tickets')
        .select(`*`)
        .eq('event_id', input.event_id);

      const ownerIds = tickets
        ?.filter((ticket) => ticket.owner_id !== null)
        ?.map((ticket) => ticket.owner_id!);

      const { data: allUsers } = await supabase.from('user_profiles').select();

      const filteredUserProfiles = allUsers?.filter(
        (profile) => !ownerIds?.includes(profile.id)
      );

      return filteredUserProfiles;
    }),

  createReservationForTicket: authedProcedure
    .input(z.object({ ticket_id: z.string(), user_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: reservation } = await supabase
        .from('reservations')
        .insert({
          user_id: input.user_id,
          ticket_id: input.ticket_id,
          expiration: new Date(Date.now() + 10 * 60000).toISOString(),
        })
        .limit(1)
        .single();

      return reservation;
    }),

  deleteReservationForTickets: authedProcedure
    .input(z.object({ ticket_ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      for (let i = 0; i < input.ticket_ids.length; i++) {
        await supabase
          .from('reservations')
          .delete()
          .eq('ticket_id', input.ticket_ids[i]!)
          .select();
      }
    }),

  createTicketsForEvent: authedProcedure
    .input(
      z.object({
        max_tickets: z.number(),
        event_id: z.string(),
        venue_id: z.string(),
        sections_ids: z.array(z.object({ value: z.string() })),
        section_prices: z.array(z.object({ value: z.number() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      let tickets_rem = 0;
      const { data: event } = await supabase
        .from('events')
        .update({ max_tickets_per_user: input.max_tickets })
        .eq('id', input.event_id)
        .select()
        .single();

      const { data: sections } = await supabase
        .from('sections')
        .select()
        .eq('venue_id', input.venue_id);

      type Tickets = {
        event_id: string;
        section_id: string;
        price: number;
        seat: string;
        stripe_price_id: string;
        token_id: number;
      };

      const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const tickets: Tickets[] = [];
      let count = 0;
      let tokenId = 0;
      for (const section_id of input.sections_ids) {
        const section = sections?.find(
          (section) => section.id === section_id.value
        );

        const stripePrice = await createStripePrice(
          event?.stripe_product_id!,
          input.section_prices[count]?.value! * 100
        );

        if (section?.number_of_rows === 0) {
          for (let i = 0; i < section.seats_per_row!; i++) {
            tickets.push({
              event_id: input.event_id,
              section_id: section_id.value,
              price: input.section_prices[count]?.value!,
              seat: section.name!,
              stripe_price_id: stripePrice.id,
              token_id: tokenId,
            });
            tokenId++;
            tickets_rem++;
          }
        } else {
          const { data: rows } = await supabase
            .from('rows')
            .select()
            .eq('section_id', section_id.value);

          for (const row of rows!) {
            for (let seat = 0; seat < row.number_of_seats!; seat++) {
              tickets.push({
                event_id: input.event_id,
                section_id: section_id.value,
                price: input.section_prices[count]?.value!,
                seat: section?.name! + ' ' + String(row.name) + names[seat],
                stripe_price_id: stripePrice.id,
                token_id: tokenId,
              });
              tokenId++;
              tickets_rem++;
            }
          }
        }
        count++;
      }

      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert(tickets)
        .select();

      const numberOfTickets = tickets.length;
      const sbtsAndCollectibles = new Array(numberOfTickets);
      for (let i = 0; i < numberOfTickets; i++) {
        sbtsAndCollectibles[i] = {
          event_id: input.event_id,
          ticket_id: ticketData![i]?.id,
        };
      }

      await supabase.from('sbts').insert(sbtsAndCollectibles);
      await supabase.from('collectibles').insert(sbtsAndCollectibles);

      return ticketData;
    }),

  scanTicket: authedProcedure
    .input(z.object({ event_id: z.string(), qr_code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: user } = await supabase
        .from('scanners')
        .select()
        .eq('user_id', ctx.user.id)
        .eq('event_id', input.event_id)
        .single();
      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unauthorized scanner!',
        });
      }

      const { data: users } = await supabase
        .from('user_profiles')
        .select(`*, user_salts(salt)`);

      for (let i = 0; i < users?.length!; i++) {
        const sha = sha256(
          users![i]?.user_salts[0]?.salt + users![i]?.wallet_address!
        ).toString();

        if (sha === input.qr_code) {
          const { data: ticket } = await supabase
            .from('tickets')
            .select()
            .eq('owner_id', users![i]?.id!)
            .eq('event_id', input.event_id)
            .limit(1)
            .single();
          if (ticket?.scanned) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Ticket already scanned!',
            });
          }
          const { data } = await supabase
            .from('tickets')
            .update({ scanned: true })
            .eq('id', ticket?.id!)
            .select()
            .single();
          return data;
        }
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No user found',
      });
    }),

  transferTicketDatabase: authedProcedure
    .input(
      z.object({
        ticket_id: z.string(),
        user_id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;

      const { data: ticketCheck } = await supabase
        .from('tickets')
        .select()
        .eq('id', opts.input.ticket_id)
        .limit(1)
        .single();

      if (!ticketCheck) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No ticket with inputted id!',
        });
      }

      if (ticketCheck?.purchaser_id != opts.ctx.user.id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Only the purchaser can transfer a ticket!',
        });
      }

      // check if person transferring ticket to has one for that event
      const { data: ticketTransfer } = await supabase
        .from('tickets')
        .select()
        .eq('owner_id', opts.input.user_id)
        .eq('event_id', ticketCheck.event_id)
        .limit(1)
        .single();

      if (ticketTransfer) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User already has a ticket for this event!',
        });
      }

      const { data: ticket, error } = await supabase
        .from('tickets')
        .update({
          owner_id: opts.input.user_id,
        })
        .eq('id', opts.input.ticket_id)
        .select()
        .single();

      return ticket;
    }),

  // needs to have some kinda auth, this gets called by the stripe webhook so it might get weird
  transferTicket: publicProcedure
    .input(
      z.object({
        ticket_id: z.string(),
        event_id: z.string(),
        user_id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data: event } = await supabase
        .from('events')
        .select()
        .eq('id', opts.input.event_id)
        .limit(1)
        .single();

      const { data: ticket, error: ticketError } = await supabase
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

      if (ticketError?.code == 'PGRST116') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          cause: ticketError,
        });
      }

      const link = event?.etherscan_link?.split('/');
      if (!link) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No etherscan link!',
        });
      }

      const address = link[link.length - 1]!;
      const provider = new ethers.JsonRpcProvider(
        process.env.ALCHEMY_SEPOLIA_URL!
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
        ticket?.token_id
      );

      console.log(
        `Token transferred! Check it out at: https://base-sepolia.blockscout.com//tx/${tx.hash}`
      );

      return tx.hash;
    }),
});
