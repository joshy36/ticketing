import { router, authedProcedure } from '../trpc';
import { z } from 'zod';
import { stripe } from '../services/stripe';
import { TRPCError } from '@trpc/server';
import { Reservation } from 'supabase';

export const paymentsRouter = router({
  createPaymentIntent: authedProcedure
    .input(
      z.object({
        event_id: z.string(),
        cart_info: z.array(
          z.object({
            section: z.object({
              id: z.string(),
              name: z.string().nullable(),
              price: z.number().optional(),
            }),
            quantity: z.number(),
          })
        ),
        price: z.number(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number((input.price * 100).toFixed(2)),
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          event_id: input.event_id,
          cart_info: JSON.stringify(input.cart_info),
          user_id: ctx.user.id,
        },
      });

      const ticketReservations: Reservation[] = [];

      for (let i = 0; i < input.cart_info.length; i++) {
        const { data: tickets } = await supabase
          .from('tickets')
          .select(`*, reservations (id), sections (name)`)
          .eq('event_id', input.event_id)
          .eq('section_id', input.cart_info[i]?.section.id!)
          .is('purchaser_id', null)
          .is('owner_id', null)
          .order('price', { ascending: true });

        const noReservationTickets = tickets?.filter(
          (ticket) => ticket.reservations === null
        );

        if (
          !noReservationTickets ||
          noReservationTickets.length < input.cart_info[i]!.quantity
        ) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Not enough tickets available for this section: ${input.cart_info[i]?.section.id}`,
          });
        }

        for (let j = 0; j < input.cart_info[i]!.quantity; j++) {
          console.log(
            'Creating reservation: ',
            input.cart_info[i]?.section.id,
            j
          );

          const { data: reservation } = await supabase
            .from('reservations')
            .insert({
              user_id: input.user_id,
              ticket_id: noReservationTickets[j]!.id,
              event_id: input.event_id,
              section_id: input.cart_info[i]?.section.id,
              expiration: new Date(Date.now() + 10 * 60000).toISOString(),
            })
            .select()
            .limit(1)
            .single();

          ticketReservations.push(reservation!);
        }
      }

      return {
        paymentIntent: paymentIntent.client_secret,
        ticketReservations: ticketReservations,
      };
    }),
});
