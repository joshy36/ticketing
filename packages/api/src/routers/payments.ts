import { router, authedProcedure } from '../trpc';
import { z } from 'zod';
import { stripe } from '../services/stripe';

export const paymentsRouter = router({
  createCheckoutSession: authedProcedure
    .input(
      z.object({
        event_id: z.string(),
        cart_info: z.array(
          z.object({
            section: z.object({
              id: z.string(),
              name: z.string().nullable(),
              stripe_price_id: z.string(),
            }),
            quantity: z.number(),
          })
        ),
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let line_items = [];
      for (let i = 0; i < input.cart_info.length; i++) {
        line_items.push({
          price: input.cart_info[i]?.section.stripe_price_id,
          quantity: input.cart_info[i]?.quantity,
        });
      }
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        ui_mode: 'embedded',
        mode: 'payment',
        // redirect_on_completion: 'never',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ticket`,
        metadata: {
          event_id: input.event_id,
          cart_info: JSON.stringify(input.cart_info),
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
