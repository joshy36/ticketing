import { Client } from '@upstash/qstash';
import { JobStatuses } from './job';
import Redis from 'ioredis';
import { Queue } from './queue';
import { Payload } from '../routers/queue';

export const c = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export const queue = new Queue({
  redis: new Redis(process.env.UPSTASH_REDIS_URL!),
  queueName: 'test',
});

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
