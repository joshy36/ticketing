import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { serverClient } from '@/app/_trpc/serverClient';
import { createRouteClient } from 'supabase';

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
    for (let i = 0; i < cartInfo.length; i++) {
      console.log('🔔 i: ', i);
      for (let j = 0; j < cartInfo[i]!.quantity; j++) {
        console.log('🔔 j: ', j);
        const { data: ticket, error: ticketError } = await supabase
          .from('tickets')
          .select()
          .is('user_id', null)
          .eq('section_id', cartInfo[i]?.section?.id!)
          .eq('event_id', metadata?.event_id!)
          .limit(1)
          .single();

        if (ticketError) {
          return NextResponse.json({ status: 500, error: ticketError });
        }

        await supabase
          .from('tickets')
          .update({ user_id: metadata?.user_id })
          .eq('id', ticket?.id!)
          .select()
          .single();

        await supabase.rpc('increment', {
          table_name: 'events',
          row_id: metadata?.event_id!,
          x: -1,
          field_name: 'tickets_remaining',
        });

        serverClient.transferTicket.mutate({
          event_id: metadata?.event_id!,
          ticket_id: ticket?.id!,
          user_id: metadata?.user_id!,
        });
      }
    }
  }

  return NextResponse.json({ status: 200 });
}
