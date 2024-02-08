import { Client } from '@upstash/qstash';
import { Job, JobStatuses } from './job';
import Redis from 'ioredis';
import { Queue } from './queue';
import { Payload } from '../routers/queue';

export const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export const createRedis = () => {
  return new Redis(process.env.UPSTASH_REDIS_URL!);
};

export const createQueue = (redis: Redis) => {
  let queueName = 'prod';
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
    queueName = 'test';
  }

  return new Queue({
    redis: redis,
    queueName: queueName,
  });
};

const MQ_PREFIX = 'JobQueue';

export const formatMessageQueueKey = (queueName: string, key: string) => {
  return `${MQ_PREFIX}:${queueName}:${key}`;
};

export const convertToJSONString = <T>(
  data: T,
  status: JobStatuses
): string => {
  return JSON.stringify({
    data,
    status,
  });
};

export const delay = (duration: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

export const executeJob = async (
  jobId: string
): Promise<Job<unknown> | void> => {
  const redis = createRedis();
  const queue = createQueue(redis);
  const job = await queue.executeJobFromQueue<Payload>(async (job) => {
    console.log('Processing job:', job.body);
    const res = await qstashClient.publishJSON({
      url: job.url,
      callback: `${process.env.UPSTASH_URL}/api/qstash-callback`,
      body: { job: job.body, jobId: jobId },
    });
  });
  await redis.quit();
  return job;
};
