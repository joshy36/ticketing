import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { serverClient } from '@/app/_trpc/serverClient';
import { createRouteClient } from 'supabase';
import { ethers } from 'ethers';
import contractAbi from '../../../../../packages/chain/deployments/base-goerli/Event.json';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function executeOrder(
  event_id: string,
  ticket_id: string,
  user_id: string,
) {
  const supabase = createRouteClient();
  const { data: event } = await supabase
    .from('events')
    .select()
    .eq('id', event_id)
    .limit(1)
    .single();

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select()
    .eq('id', ticket_id)
    .limit(1)
    .single();

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select()
    .eq('id', user_id)
    .limit(1)
    .single();

  if (ticketError?.code == 'PGRST116') {
    return NextResponse.json({ error: ticketError }, { status: 500 });
  }

  const link = event?.etherscan_link?.split('/');
  if (!link) {
    return NextResponse.json({ error: 'No etherscan link!' }, { status: 500 });
  }

  const address = link[link.length - 1]!;

  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_GOERLI_URL!);

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const eventContract = new ethers.Contract(address, contractAbi.abi, signer);

  // @ts-ignore
  let tx = await eventContract.safeTransferFrom(
    signer.address,
    userProfile?.wallet_address,
    ticket?.token_id,
  );
  await tx.wait();
  console.log(
    `Token transferred! Check it out at: https://goerli.basescan.org/tx/${tx.hash}`,
  );

  const { data: transferTicket, error: transferTicketError } = await supabase
    .from('tickets')
    .update({ user_id: user_id })
    .eq('id', ticket?.id!)
    .select()
    .single();

  await supabase.rpc('increment', {
    table_name: 'events',
    row_id: event_id,
    x: -1,
    field_name: 'tickets_remaining',
  });

  return transferTicket;
}

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

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      },
    );

    const lineItems = sessionWithLineItems.line_items;
    const metadata = sessionWithLineItems.metadata;

    executeOrder(metadata?.event_id!, metadata?.ticket_id!, metadata?.user_id!);
  }

  return NextResponse.json({ status: 200 });
}
