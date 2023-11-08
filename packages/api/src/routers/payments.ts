import { router, publicProcedure, authedProcedure } from '../trpc';
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
    .mutation(async (opts) => {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: opts.input.price,
            quantity: 1,
          },
        ],
        ui_mode: 'embedded',
        mode: 'payment',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/event/list`,
        metadata: {
          event_id: opts.input.event_id,
          ticket_id: opts.input.ticket_id,
          user_id: opts.input.user_id,
        },
      });

      return { clientSecret: session.client_secret };
    }),
});
