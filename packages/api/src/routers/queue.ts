import { executeJob, createQueue, createRedis } from './../job-queue/utils';
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
      const redis = createRedis();
      const queue = createQueue(redis);
      const payload = {
        url: `${process.env.UPSTASH_URL}/api/qstash-endpoint`,
        body: {
          method: input.method,
          params: input.params,
        },
      };
      console.log('Adding job to queue');
      const jobId = await queue.add(payload);
      await redis.quit();
      console.log(`Added job with jobId: ${jobId}`);
      // // try and run the job immediately, if there is other stuff in the queue, it will run after
      // executeJob(jobId!);
      return jobId;
    }),

  getNextJobById: publicProcedure.query(async ({ ctx }) => {
    console.log('Getting next job');
    const redis = createRedis();
    const queue = createQueue(redis);
    const job = await queue.getNextJobById();
    await redis.quit();
    console.log('Next job:', job);
    return job;
  }),

  executeJobFromQueue: publicProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log('Executing job from queue');
      const job = await executeJob(input.jobId);
      console.log('Executed job:', job);
      return job;
    }),

  finishJob: publicProcedure
    .input(z.object({ job: z.string(), hasFailed: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const redis = createRedis();
      const queue = createQueue(redis);
      const job = await queue.finishJob(input.job, input.hasFailed);
      await redis.quit();
      return job;
    }),
});
