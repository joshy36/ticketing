import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createStripePrice } from '../services/stripe';
import { ethers } from 'ethers';
import contractAbi from '../../../../packages/chain/deployments/base-goerli/Event.json';
import sha256 from 'crypto-js/sha256';
import { Inngest } from 'inngest';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'my-app' });

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

      return {
        tickets: data,
      };
    }),

  getTicketsForUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('tickets')
        .select(
          `*, events (id, image, name, etherscan_link, date, venues (name))`
        )
        .or(`purchaser_id.eq.${input.user_id},owner_id.eq.${input.user_id}`)
        .order('id', { ascending: true });

      // const { data: ownedTicket } = await supabase
      //   .from('tickets')
      //   .select(`*, events (id, image, name, etherscan_link, date)`)
      //   .eq('owner_id', input.user_id)
      //   .single();

      const { data: pushRequestTickets } = await supabase
        .from('ticket_transfer_push_requests')
        .select(
          `*, to_profile:user_profiles!ticket_transfer_push_requests_to_fkey(*)`
        )
        .eq('from', input.user_id);

      return {
        tickets: data,
        pushRequestTickets: pushRequestTickets,
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

      const { data: scanner } = await supabase
        .from('scanners')
        .select()
        .eq('user_id', ctx.user.id)
        .eq('event_id', input.event_id)
        .single();

      if (!scanner) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unauthorized scanner!',
        });
      }

      const { data: user } = await supabase
        .from('user_salts')
        .select(`*, user_profiles (*)`)
        .eq('salt', input.qr_code)
        .single();

      const { data: ticket } = await supabase
        .from('tickets')
        .select()
        .eq('owner_id', user?.user_id!)
        .eq('event_id', input.event_id)
        .limit(1)
        .single();

      if (!ticket) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User does not have a ticket to this event!',
        });
      }

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
    }),

  requestTransferTicketPush: authedProcedure
    .input(z.object({ to: z.string(), ticket_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: ticket } = await supabase
        .from('tickets')
        .select()
        .eq('id', input.ticket_id)
        .limit(1)
        .single();

      if (!ticket) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No ticket with inputted id!',
        });
      }

      if (!ticket.owner_id && ticket.purchaser_id != user.id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Not the owner of the ticket!',
        });
      }

      if (ticket.owner_id && ticket.owner_id != user.id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Not the owner of the ticket!',
        });
      }

      // if there is no owner and the current user did not purchase
      // if there is an owner and the current user is not the owner

      await supabase
        .from('ticket_transfer_push_requests')
        .insert({
          from: user.id,
          to: input.to,
          ticket_id: input.ticket_id,
        })
        .select();
    }),

  cancelTicketTransferPush: authedProcedure
    .input(z.object({ ticket_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: ticket } = await supabase
        .from('tickets')
        .select()
        .eq('id', input.ticket_id)
        .limit(1)
        .single();

      if (!ticket) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No ticket with inputted id!',
        });
      }

      if (!ticket.owner_id && ticket.purchaser_id != user.id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Not the owner of the ticket!',
        });
      }

      if (ticket.owner_id && ticket.owner_id != user.id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Not the owner of the ticket!',
        });
      }

      await supabase
        .from('ticket_transfer_push_requests')
        .delete()
        .eq('ticket_id', input.ticket_id);
    }),

  getPendingTicketTransferPushRequests: authedProcedure.query(
    async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      const { data: pushRequests } = await supabase
        .from('ticket_transfer_push_requests')
        .select(
          `*, from_profile:user_profiles!ticket_transfer_push_requests_from_fkey(*), tickets(*, events(*))`
        )
        .eq('to', user.id)
        .eq('status', 'pending');

      return pushRequests;
    }
  ),

  rejectTicketTransferPush: authedProcedure
    .input(z.object({ ticket_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const user = ctx.user;

      await supabase
        .from('ticket_transfer_push_requests')
        .delete()
        .eq('ticket_id', input.ticket_id)
        .eq('to', user.id);
    }),

  acceptTicketTransferPush: authedProcedure
    .input(
      z.object({
        ticket_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      const { data: request, error: ticketError } = await supabase
        .from('ticket_transfer_push_requests')
        .update({
          status: 'accepted',
        })
        .eq('ticket_id', input.ticket_id)
        .select()
        .single();

      if (ticketError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Ticket request is no longer available!',
        });
      }

      const user_id = request?.to!;

      const { data: ticketCheck } = await supabase
        .from('tickets')
        .select()
        .eq('id', input.ticket_id)
        .limit(1)
        .single();

      if (!ticketCheck) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No ticket with inputted id!',
        });
      }

      // // check if person transferring ticket to has one for that event
      // const { data: ticketTransfer } = await supabase
      //   .from('tickets')
      //   .select()
      //   .eq('owner_id', user_id)
      //   .eq('event_id', ticketCheck.event_id)
      //   .limit(1)
      //   .single();

      // if (ticketTransfer) {
      //   throw new TRPCError({
      //     code: 'INTERNAL_SERVER_ERROR',
      //     message: 'User already has a ticket for this event!',
      //   });
      // }

      const { data: ticket, error } = await supabase
        .from('tickets')
        .update({
          owner_id: user_id,
        })
        .eq('id', input.ticket_id)
        .select()
        .single();

      await inngest.send({
        name: 'ticket/transfer',
        data: {
          event_id: ticket?.event_id,
          ticket_id: ticket?.id!,
          user_id: user_id,
        },
      });

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
        `Token transferred! Check it out at: https://base-sepolia.blockscout.com/tx/${tx.hash}`
      );

      await supabase
        .from('tickets')
        .update({
          current_wallet_address: userProfile?.wallet_address,
        })
        .eq('id', opts.input.ticket_id);

      return tx.hash;
    }),
});
