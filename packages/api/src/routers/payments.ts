import { router, authedProcedure } from '../trpc';
import { z } from 'zod';
import { stripe } from '../services/stripe';

export const paymentsRouter = router({
  createCheckoutSession: authedProcedure
    .input(
      z.object({
        price: z.string(),
        event_id: z.string(),
        ticket_id: z.string(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: input.price,
            quantity: 1,
          },
        ],
        ui_mode: 'embedded',
        mode: 'payment',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ticket`,
        metadata: {
          event_id: input.event_id,
          ticket_id: input.ticket_id,
          user_id: ctx.user.id,
        },
      });

      return { clientSecret: session.client_secret };
    }),

  createPaymentIntent: authedProcedure
    .input(
      z.object({
        event_id: z.string(),
        cart_info: z.array(
          z.object({
            section: z.object({ id: z.string(), name: z.string().nullable() }),
            quantity: z.number(),
          })
        ),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.price * 100,
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

      return { paymentIntent: paymentIntent.client_secret };
    }),
});
