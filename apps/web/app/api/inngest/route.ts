// src/app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '../../../inngest/client';
import { helloWorld, transferTicket } from '../../../inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, transferTicket],
});
