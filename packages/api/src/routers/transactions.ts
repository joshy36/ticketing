import { z } from 'zod';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { stripe } from '../services/stripe';

export const transactionsRouter = router({
  // createTransaction: authedProcedure
  //   .input(
  //     z.object({
  //       user_id: z.string(),
  //       event_id: z.string(),
  //       amount: z.number(),
  //       paymentIntent: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const supabase = ctx.supabase;
  //     const { data } = await supabase
  //       .from('transactions')
  //       .insert({
  //         user_id: input.user_id,
  //         event_id: input.event_id,
  //         amount: input.amount,
  //         stripe_payment_intent: input.paymentIntent,
  //       })
  //       .select()
  //       .limit(1)
  //       .single();
  //     return data;
  //   }),
  // redirect to a confirmation page
  // use payment intent in query param to fetch transaction_id and check if paymentinent was successfull
  // then link to the ticket page

  getStripePaymentIntent: authedProcedure
    .input(z.object({ paymentIntent: z.string() }))
    .query(async ({ ctx, input }) => {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        input.paymentIntent
      );
      return paymentIntent;
    }),
});
