import { NextResponse } from 'next/server';
import { inngest } from '../../../inngest/client'; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

// Create a simple async Next.js API route handler
export async function GET() {
  await inngest.send({
    name: 'ticket/transfer',
    data: {
      event_id: 'c6252f54-be2b-4edc-8533-a0478d4474e0',
      ticket_id: 'b53739dd-d376-476b-9941-75645a52e534',
      user_id: '699d0320-769b-4999-a232-3f7517c8ff2a',
    },
  });

  return NextResponse.json({ name: 'Hello Inngest from Next!' });
}
