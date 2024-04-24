// src/app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '../../../inngest/client';
import {
  generatePfpForUser,
  helloWorld,
  transferTicket,
  transferTicketDatabase,
} from '../../../inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    transferTicket,
    transferTicketDatabase,
    generatePfpForUser,
  ],
});
