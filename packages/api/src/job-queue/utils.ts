import { Client } from '@upstash/qstash';
import { Job, JobStatuses } from './job';
import Redis from 'ioredis';
import { Queue } from './queue';
import { Payload } from './types';

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

export const addJobToQueue = async (
  method: string,
  params: any
): Promise<string | null> => {
  const redis = createRedis();
  const queue = createQueue(redis);
  const payload = {
    url: `${process.env.UPSTASH_URL}/api/qstash-endpoint`,
    body: {
      method: method,
      params: params,
    },
  };
  console.log('Adding job to queue');
  const jobId = await queue.add(payload);
  await redis.quit();
  console.log(`Added job with jobId: ${jobId}`);
  return jobId;
};

export const executeNextJob = async (): Promise<Job<unknown> | void> => {
  console.log('QUEUE::executeJob');
  const redis = createRedis();
  const queue = createQueue(redis);
  const jobId = await queue.getNextJobById();
  console.log('QUEUE::executeJob jobId:', jobId);
  if (!jobId) {
    console.log('QUEUE::no jobs on queue');
    await redis.quit();
    return;
  }
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

export const finishJob = async (job: string, hasFailed?: boolean) => {
  const redis = createRedis();
  const queue = createQueue(redis);
  const jobStatus = await queue.finishJob(job, hasFailed);
  await redis.quit();
  return jobStatus;
};
