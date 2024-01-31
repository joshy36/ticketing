import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import { serverClient } from '@/app/_trpc/serverClient';

async function handler(req: NextRequest) {
  console.log('qstash-endpoint Received message');
  const body = await req.json();
  console.log('qstash-endpoint body: ', body);
  if (body.method === 'transferTicket') {
    console.log('qstash-endpoint Transferring ticket...');
    try {
      const ticket = await serverClient.transferTicket.mutate({
        event_id: body.params.event_id,
        ticket_id: body.params.ticket_id,
        user_id: body.params.user_id,
      });
      console.log('qstash-endpoint ticket: ', ticket);
      // i got confused here before so im going to make an extra note
      // this is to trigger the next job in the queue (if there is one)
      console.log('EXECUTING NEXT JOB');
      await serverClient.executeJobFromQueue.mutate();
    } catch (err) {
      console.log('qstash-endpoint error: ', err);
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
  return NextResponse.json({ body: 'Success' }, { status: 200 });
}

export const POST = verifySignatureAppRouter(handler);
