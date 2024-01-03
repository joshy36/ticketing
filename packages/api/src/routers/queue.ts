import { c, queue } from './../job-queue/utils';
import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';

type TransferTicket = {
  method: 'transferTicket';
  event_id: string;
  ticket_id: string;
  user_id: string;
};

type AnotherTransaction = {
  method: 'anotherMethod';
  event_id: string;
  user_id: string;
};

type JobType = TransferTicket | AnotherTransaction;

export type Payload = {
  id: number;
  url: string;
  body: JobType;
};

export const queueRouter = router({
  addJobToQueue: publicProcedure
    // probably need to narrow params down to a type
    .input(z.object({ method: z.string(), params: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const payload = {
        url: 'https://qstash.upstash.io/v2/publish/https://internally-internal-walleye.ngrok-free.app/api/qstash-endpoint',
        body: {
          method: input.method,
          params: input.params,
        },
      };
      const jobId = await queue.add(payload);
      console.log(`Added job with jobId: ${jobId}`);
      await queue.executeJobFromQueue<Payload>(async (job) => {
        console.log('Processing job:', job.body);
        const res = await c.publishJSON({
          url: job.url,
          // callback: `${process.env.UPSTASH_URL}/qstash-callback`,
          body: job.body,
        });
      });
      return jobId;
    }),

  executeJobFromQueue: publicProcedure.mutation(async ({ ctx, input }) => {
    await queue.executeJobFromQueue<Payload>(async (job) => {
      console.log('Processing job:', job.body);
      const res = await c.publishJSON({
        url: job.url,
        // callback: `${process.env.UPSTASH_URL}/qstash-callback`,
        body: job.body,
      });
    });
  }),
});
