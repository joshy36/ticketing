import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteClient } from 'supabase';
import { inngest } from '@/inngest/client';

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
        if (
          (userHasTicketToEvent && userHasTicketToEvent?.length > 0) ||
          i != 0 ||
          j != 0
        ) {
          console.log('send to inngest');
          const ticket = await inngest.send({
            name: 'ticket/transferdb',
            data: {
              purchaser_id: metadata?.user_id!,
              transaction_id: transaction?.id!,
              section_id: cartInfo[i]?.section.id!,
              event_id: metadata?.event_id!,
            },
          });
          console.log(`sent to inngest ${ticket}`);
        } else if (i == 0 && j == 0) {
          // give first ticket to user
          const { data: ticket } = await supabase
            .from('tickets')
            .update({
              owner_id: metadata?.user_id,
              purchaser_id: metadata?.user_id,
              transaction_id: transaction?.id,
            })
            .is('purchaser_id', null)
            .is('owner_id', null)
            .eq('section_id', cartInfo[i]?.section?.id!)
            .eq('event_id', metadata?.event_id!)
            .order('id', { ascending: true })
            .select()
            .limit(1)
            .single();

          console.log(`send to inngest ${ticket?.id}`);

          await inngest.send({
            name: 'ticket/transfer',
            data: {
              event_id: metadata?.event_id!,
              ticket_id: ticket?.id!,
              user_id: metadata?.user_id!,
            },
          });
        }
      }
    }
  }

  return NextResponse.json({ status: 200 });
}
