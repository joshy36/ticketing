import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { Job, JobStatuses } from './job';
import { convertToJSONString, formatMessageQueueKey } from './utils';

const MAX_REDIS_FAILURE_RETRY_DELAY_IN_MS = 30000;
const MAX_RETRIES = 5;

export type QueueConfig = {
  redis: Redis;
  queueName: string;
  /**
   * ```ts
   * keepOnSuccess: true
   * ```
   * Retry in milliseconds for failure during Redis fetch
   * @default 500
   * */
  retryDelay?: number;
  /**
   * ```ts
   * keepOnSuccess: true
   * ```
   * This allows you to keep data in Redis after successfully processing them
   * @default true
   * */
  keepOnSuccess?: boolean;
  /**
   * ```ts
   * keepOnFailure: true
   * ```
   * This allows you to keep data in Redis after failling gracefully during the processing
   * @default true
   * */
  keepOnFailure?: boolean;
};

// adapted from https://github.com/ogzhanolguncu/ts-message-queue/

export class Queue extends EventEmitter {
  config: QueueConfig;
  worker: any;
  running = 0;

  constructor(config: QueueConfig) {
    super();
    this.config = {
      redis: config.redis,
      queueName: config.queueName,
      keepOnFailure: config.keepOnFailure ?? true,
      keepOnSuccess: config.keepOnSuccess ?? true,
      retryDelay: config.retryDelay ?? 500,
    };
  }

  createQueueKey(key: string) {
    return formatMessageQueueKey(this.config.queueName, key);
  }

  async add<T>(payload: T) {
    console.log('QUEUE::add');
    const jobId = await new Job<T>(this.config, payload).save();
    return jobId;
  }

  async activateJob(): Promise<string | null> {
    console.log('QUEUE::activateJob');
    try {
      // Check if "active" queue is empty
      const activeQueueLength = await this.config.redis.llen(
        this.createQueueKey('active')
      );
      const waitingQueueLength = await this.config.redis.llen(
        this.createQueueKey('waiting')
      );
      if (waitingQueueLength === 0) {
        console.log('QUEUE::waiting queue is empty');
        return null;
      }
      if (activeQueueLength === 0) {
        const jobId = await this.config.redis.brpoplpush(
          this.createQueueKey('waiting'),
          this.createQueueKey('active'),
          0
        );
        console.log('QUEUE::activated');
        return jobId;
      } else {
        console.log('QUEUE::only 1 active job allowed');
        return null;
      }
    } catch (error) {
      console.error('Error fetching the next job:', error);
      throw error;
    }
  }

  async executeJobFromQueue<TJobPayload>(
    worker: (job: TJobPayload) => void
  ): Promise<Job<unknown> | undefined> {
    console.log('QUEUE::executeJobFromQueue');
    let activeQueueLength = await this.config.redis.llen(
      this.createQueueKey('active')
    );

    // why wait?
    while (activeQueueLength > 0) {
      console.log('QUEUE::currently running a job');
      activeQueueLength = await this.config.redis.llen(
        this.createQueueKey('active')
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await this.activateJob();
    this.worker = worker;
    const jobId = await this.config.redis.lindex(
      this.createQueueKey('active'),
      0
    );
    if (jobId === null) {
      console.log('List is empty');
      return;
    }

    const jobCreatedById = await new Job(this.config, null).fromId(jobId);
    if (jobCreatedById) {
      let hasError = false;
      try {
        await this.worker(jobCreatedById.data);
      } catch (error) {
        hasError = true;
        console.log('Error processing job:', error);
      } finally {
        return jobCreatedById;
      }
    } else {
      console.error(`Job not found with ID: ${jobId}`);
    }
  }

  async finishJob<TJobPayload>(
    // job: Job<TJobPayload>,
    jobId: string,
    hasFailed?: boolean
  ): Promise<[JobStatuses, Job<unknown>] | void> {
    console.log('QUEUE::finishJob');
    const multi = this.config.redis.multi();

    const job = await new Job(this.config, null).fromId(jobId);

    if (!job) {
      return;
    }

    multi.lrem(this.createQueueKey('active'), 0, job.id);

    if (hasFailed) {
      job.status = 'failed';
      if (this.config.keepOnFailure) {
        multi.hset(
          this.createQueueKey('jobs'),
          job.id,
          convertToJSONString(job.data, job.status)
        );
        multi.sadd(this.createQueueKey('failed'), job.id);
      } else {
        multi.hdel(this.createQueueKey('jobs'), job.id);
      }
    } else {
      if (this.config.keepOnSuccess) {
        multi.hset(
          this.createQueueKey('jobs'),
          job.id,
          convertToJSONString(job.data, job.status)
        );
        multi.sadd(this.createQueueKey('succeeded'), job.id);
      } else {
        multi.hdel(this.createQueueKey('jobs'), job.id);
      }
      job.status = 'succeeded';
    }

    await multi.exec();
    return [job.status, job];
  }

  async getNextJobById(): Promise<string | null> {
    const waitingQueueLength = await this.config.redis.llen(
      this.createQueueKey('waiting')
    );
    if (waitingQueueLength === 0) {
      console.log('QUEUE::waiting queue is empty');
      return null;
    } else {
      const lastJobId = await this.config.redis.lrange(
        this.createQueueKey('waiting'),
        -1,
        -1
      );
      const nextJobId = lastJobId[0];
      console.log('QUEUE::waiting queue is not empty, jobId:', nextJobId);

      return nextJobId!;
    }
  }

  // async removeJob(jobId: string) {
  //   // const addJobToQueueScript = await Bun.file(
  //   //   './src/lua-scripts/remove-job.lua',
  //   // ).text();
  //   const addJobToQueueScript = fs.readFileSync(
  //     './lua-scripts/remove-job.lua',
  //     'utf8',
  //   );
  //   return await this.config.redis.eval(
  //     addJobToQueueScript,
  //     5,
  //     this.createQueueKey('succeeded'),
  //     this.createQueueKey('failed'),
  //     this.createQueueKey('waiting'),
  //     this.createQueueKey('active'),
  //     this.createQueueKey('jobs'),
  //     jobId,
  //   );
  // }

  // async destroy() {
  //   const args = ['id', 'jobs', 'waiting', 'active', 'succeeded', 'failed'].map(
  //     (key) => this.createQueueKey(key),
  //   );
  //   const res = await this.config.redis.del(...args);
  //   return res;
  // }
}
