import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { convertToJSONString, formatMessageQueueKey } from './utils';

type OwnerQueue = {
  redis: Redis;
  queueName: string;
};

export type JobStatuses =
  | 'created'
  | 'waiting'
  | 'active'
  | 'succeeded'
  | 'failed';

export class Job<T> {
  id: string;
  status: JobStatuses;
  config: OwnerQueue;
  data: T;

  constructor(ownerConfig: OwnerQueue, data: T, jobId = randomUUID()) {
    this.id = jobId;
    this.status = 'created';
    this.data = data;
    this.config = ownerConfig;
  }

  private createQueueKey(key: string) {
    return formatMessageQueueKey(this.config.queueName, key);
  }

  addJobToQueue = async (
    key1: string,
    key2: string,
    jobId: string,
    payload: string
  ) => {
    const exists = await this.config.redis.hexists(key1, jobId);
    if (exists) return null;

    await this.config.redis.hset(key1, jobId, payload);
    await this.config.redis.lpush(key2, jobId);

    return jobId;
  };

  fromId = async <T>(jobId: string): Promise<Job<T> | null> => {
    const jobData = await this.config.redis.hget(
      this.createQueueKey('jobs'),
      jobId
    );
    if (jobData) {
      return this.fromData<T>(jobId, jobData);
    }
    return null;
  };

  private fromData = <T>(jobId: string, stringifiedJobData: string): Job<T> => {
    const parsedData = JSON.parse(stringifiedJobData) as Job<T>;
    // @ts-ignore
    const job = new Job<T>(this.config, parsedData.data, jobId);
    job.status = parsedData.status;
    return job;
  };

  async save(): Promise<string | null> {
    const resJobId = await this.addJobToQueue(
      this.createQueueKey('jobs'),
      this.createQueueKey('waiting'),
      this.id,
      convertToJSONString(this.data, this.status)
    );

    if (resJobId) {
      this.id = resJobId;
      return resJobId;
    }
    return null;
  }
}
