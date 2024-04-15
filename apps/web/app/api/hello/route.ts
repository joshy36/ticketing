import { NextResponse } from 'next/server';
import { inngest } from '../../../inngest/client'; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

// Create a simple async Next.js API route handler
export async function GET() {
  await inngest.send({
    name: 'ticket/transfer.database',
    data: {
      purchaser_id: 'asdfsd',
      transaction_id: 'asdfasdf',
      section_id: 'asdf',
      event_id: 'asdffs',
    },
  });

  return NextResponse.json({ name: 'Hello Inngest from Next!' });
}
