import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import Stripe from 'stripe';
require('dotenv').config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const stripe = new Stripe(
  'sk_test_51O7hLgFsne4uARGMEwo2YrJQsPCMrnwXTENntV6wj1OAUEngRRW6Zvtt0I0P2JXXOYFceOxRJMYTSzhJn3Y7Un8u00o6ZEumaE'
);

export const paymentsRouter = router({
  createCheckoutSession: authedProcedure.mutation(async (opts) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1O7hU9Fsne4uARGMBdsfw7TA',
          quantity: 1,
        },
      ],
      ui_mode: 'embedded',
      mode: 'payment',
      return_url: `http://localhost:3000/event/list`,
    });

    return { clientSecret: session.client_secret };
  }),

  createProduct: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
      })
    )
    .mutation(async (opts) => {}),
});
