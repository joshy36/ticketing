// src/app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '../../../inngest/client';
import {
  generatePfpForUser,
  helloWorld,
  transferTicket,
  generateImages,
} from '../../../inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, transferTicket, generatePfpForUser, generateImages],
});
