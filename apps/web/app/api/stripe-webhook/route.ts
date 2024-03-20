import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteClient } from 'supabase';
import { addJobToQueue, executeNextJob } from 'api/src/job-queue/utils';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const metadata = event.data.object.metadata;
    const cartInfo: {
      section: { id: string; name: string };
      quantity: number;
      // @ts-ignore
    }[] = JSON.parse(metadata.cart_info);
    console.log('🔔 cartInfo: ', cartInfo);
    const supabase = createRouteClient();

    const { data: transaction } = await supabase
      .from('transactions')
      .insert({
        user_id: metadata.user_id!,
        event_id: metadata.event_id!,
        amount: event.data.object.amount,
        stripe_payment_intent: event.data.object.id,
      })
      .select()
      .limit(1)
      .single();

    const { data: userHasTicketToEvent } = await supabase
      .from('tickets')
      .select()
      .eq('owner_id', metadata.user_id!)
      .eq('event_id', metadata.event_id!);

    for (let i = 0; i < cartInfo.length; i++) {
      for (let j = 0; j < cartInfo[i]!.quantity; j++) {
        const { data: ticket, error: ticketError } = await supabase
          .from('tickets')
          .select()
          .is('purchaser_id', null)
          .is('owner_id', null)
          .eq('section_id', cartInfo[i]?.section?.id!)
          .eq('event_id', metadata?.event_id!)
          .limit(1)
          .single();

        if (ticketError) {
          return NextResponse.json({ status: 500, error: ticketError });
        }

        if (
          (userHasTicketToEvent && userHasTicketToEvent?.length > 0) ||
          i != 0 ||
          j != 0
        ) {
          await supabase
            .from('tickets')
            .update({
              purchaser_id: metadata?.user_id,
              transaction_id: transaction?.id,
            })
            .eq('id', ticket?.id!)
            .select()
            .single();
        } else if (i == 0 && j == 0) {
          // give first ticket to user
          await supabase
            .from('tickets')
            .update({
              owner_id: metadata?.user_id,
              purchaser_id: metadata?.user_id,
              transaction_id: transaction?.id,
            })
            .eq('id', ticket?.id!)
            .select()
            .single();

          // await addJobToQueue('transferTicket', {
          //   event_id: metadata?.event_id!,
          //   ticket_id: ticket?.id!,
          //   user_id: metadata?.user_id!,
          // });
        }

        console.log('stripe-webhook job added');
      }
    }
    // also add jobs to queue to speed this thing up
    // instead of get next job and then execute should be a executeNextJOb for concurency
    // executeNextJob();
  }

  return NextResponse.json({ status: 200 });
}
