import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { createStripeProduct, stripe } from '../services/stripe';
import { getOrganizationMembers } from '../shared/organizations';
import { TRPCError } from '@trpc/server';
import { Inngest } from 'inngest';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'my-app' });

export const eventsRouter = router({
  getEvents: publicProcedure.query(async ({ ctx }) => {
    const supabase = ctx.supabase;
    const { data } = await supabase
      .from('events')
      .select(`*, venues (name), artists (name)`);
    return data;
  }),

  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('events')
        .select()
        .eq('id', input.id)
        .limit(1)
        .single();
      return data;
    }),

  getEventsByOrganization: publicProcedure
    .input(z.object({ organization_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      const { data: events } = await supabase
        .from('events')
        .select(`*, venues (name, image), artists (name, image)`)
        .eq('organization_id', input.organization_id);

      return events;
    }),

  getSectionPriceByEvent: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: event } = await supabase
        .from('events')
        .select()
        .eq('id', input.event_id)
        .limit(1)
        .single();
      const { data: venue } = await supabase
        .from('venues')
        .select()
        .eq('id', event?.venue!)
        .limit(1)
        .single();
      const { data: sections } = await supabase
        .from('sections')
        .select()
        .eq('venue_id', venue?.id!);
      let sectionPrices: {
        section_id: string;
        section_name: string | null;
        price: number;
        stripe_price_id: string;
      }[] = [];
      for (let i = 0; i < sections!.length; i++) {
        // console.log('Sections', sections![i]?.id!);
        const { data: ticket } = await supabase
          .from('tickets')
          .select()
          .eq('section_id', sections![i]?.id!)
          .eq('event_id', input.event_id)
          .limit(1)
          .single();
        // console.log(ticket);
        sectionPrices.push({
          section_id: sections![i]?.id!,
          section_name: sections![i]?.name!,
          price: ticket?.price!,
          stripe_price_id: ticket?.stripe_price_id!,
        });
      }
      return sectionPrices;
    }),

  createEvent: authedProcedure
    .input(
      z.object({
        name: z.string(),
        artist: z.string(),
        venue: z.string(),
        description: z.string(),
        date: z.date(),
        image: z.string().nullable(),
        organization_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const stripeProduct = await createStripeProduct(input.name);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          name: input.name,
          artist: input.artist,
          venue: input.venue,
          description: input.description,
          date: input.date.toISOString(),
          created_by: ctx.user?.id!,
          stripe_product_id: stripeProduct.id,
          image: input.image ?? null,
          organization_id: input.organization_id,
        })
        .select()
        .limit(1)
        .single();

      const orgMembers = await getOrganizationMembers(
        supabase,
        input.organization_id
      );

      // make all org members scanners for this event
      for (let i = 0; i < orgMembers!.length; i++) {
        await supabase
          .from('scanners')
          .insert({
            user_id: orgMembers![i]?.user_id!,
            event_id: eventData?.id!,
          })
          .select();
      }

      return eventData;
    }),

  updateEvent: publicProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('events')
        .update(input)
        .eq('id', input.id)
        .select()
        .single();

      return data;
    }),

  getScannersForEvent: authedProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data } = await supabase
        .from('scanners')
        .select(`*, user_profiles (*)`)
        .eq('event_id', input.event_id);
      return data;
    }),

  addScannerToEvent: authedProcedure
    .input(z.object({ username: z.string(), event_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: user } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .limit(1)
        .single();

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .limit(1)
        .single();

      const { data: isScanner } = await supabase
        .from('scanners')
        .select()
        .eq('user_id', userProfile?.id!)
        .eq('event_id', input.event_id)
        .limit(1)
        .single();

      if (isScanner) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User is already a scanner',
        });
      }

      const { data } = await supabase
        .from('scanners')
        .insert({
          user_id: userProfile?.id!,
          event_id: input.event_id,
        })
        .select();

      return data;
    }),

  removeScannerFromEvent: authedProcedure
    .input(z.object({ username: z.string(), event_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: user } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .limit(1)
        .single();

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('username', input.username)
        .limit(1)
        .single();

      const { data: isScanner } = await supabase
        .from('scanners')
        .select()
        .eq('user_id', userProfile?.id!)
        .eq('event_id', input.event_id)
        .limit(1)
        .single();

      if (!isScanner) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User is not a scanner',
        });
      }

      const { error } = await supabase
        .from('scanners')
        .delete()
        .eq('user_id', userProfile?.id!)
        .eq('event_id', input.event_id);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error removing scanner: ' + error,
        });
      }
    }),

  getRevenueForEvent: authedProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: event } = await supabase
        .from('events')
        .select()
        .eq('id', input.event_id)
        .limit(1)
        .single();

      const { data: userOrg } = await supabase
        .from('organization_members')
        .select()
        .eq('user_id', ctx.user?.id!)
        .limit(1)
        .single();

      if (userOrg?.organization_id !== event?.organization_id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User is not in the organization',
        });
      }

      const { data: transactions } = await supabase
        .from('transactions')
        .select()
        .eq('event_id', input.event_id);

      const totalAmount = transactions?.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      if (transactions?.length === 0 || !transactions) {
        return {
          revenue: 0,
          stripeFees: 0,
          ourFees: 0,
          profit: 0,
        };
      }

      let stripeFees = 0;
      for (let i = 0; i < transactions.length; i++) {
        stripeFees += 30;
        // @ts-ignore
        stripeFees += transactions[i].amount * 0.029;
      }

      let ourFees = 0;
      for (let i = 0; i < transactions.length; i++) {
        // @ts-ignore
        ourFees += transactions[i].amount * 0.05;
      }

      const profit = totalAmount! - stripeFees - ourFees;

      return {
        revenue: totalAmount,
        stripeFees: stripeFees,
        ourFees: ourFees,
        profit: profit,
      };
    }),

  getScannedInUsersForEvent: authedProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { data: tickets } = await supabase
        .from('tickets')
        .select(`*, ticket_profile:user_profiles!tickets_owner_id_fkey(*)`)
        .eq('event_id', input.event_id)
        .eq('scanned', true);

      if (!tickets) {
        return [];
      }
      return tickets;
    }),

  generateEventImages: authedProcedure
    .input(z.object({ event_id: z.string(), prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const { count: numTickets } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', input.event_id);

      if (!numTickets) {
        console.log('No tickets found');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No tickets found',
        });
      }

      for (let i = 0; i < numTickets; i++) {
        await inngest.send({
          name: 'image/generate',
          data: {
            event_id: input.event_id,
            token_id: i,
            prompt: input.prompt,
          },
        });
      }

      console.log('num: ', numTickets);
    }),

  getNewUsersForEvent: authedProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supabase = ctx.supabase;

      const { data: event } = await supabase
        .from('events')
        .select()
        .eq('id', input.event_id)
        .limit(1)
        .single();

      const currentEventDate = new Date(event?.date!);

      const { data: tickets } = await supabase
        .from('tickets')
        .select(`*`)
        .eq('event_id', input.event_id);

      const ownedTickets = tickets?.filter(
        (ticket) => ticket.owner_id !== null
      );

      let newUsers = 0;

      for (let i = 0; i < ownedTickets!.length; i++) {
        const { data: userTickets } = await supabase
          .from('tickets')
          .select(`*, events(*)`)
          .eq('owner_id', ownedTickets![i]?.owner_id!);

        const pastEventsWithOrg = userTickets?.filter((ticket) => {
          const ticketEventDate = new Date(ticket.events?.date!); // Convert ticket event date to Date object
          return (
            ticket.events?.organization_id === event?.organization_id &&
            ticketEventDate < currentEventDate
          );
        });

        if (pastEventsWithOrg?.length === 0) {
          newUsers++;
        }
      }

      return newUsers;
    }),
});
