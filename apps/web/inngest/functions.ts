import { serverClient } from '@/app/_trpc/serverClient';
import { inngest } from './client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world', concurrency: 1 },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    // await step.sleep('wait-a-moment', '10s');
    await step.run('simulate work', async () => {
      // use await to sleep for 10 s
      console.log('Sleeping for 10s');
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log('Done sleeping');
    });
    return { event, body: 'Hello, World!' };
  },
);

export const transferTicket = inngest.createFunction(
  { id: 'transfer-ticket', concurrency: 1 },
  { event: 'ticket/transfer' },
  async ({ event, step }) => {
    console.log(`INNGEST::recieved: ${event.data.ticket_id}`);
    await step.run('transfer', async () => {
      try {
        const tx = await serverClient.transferTicket.mutate({
          event_id: event.data.event_id,
          ticket_id: event.data.ticket_id,
          user_id: event.data.user_id,
        });
        return { event, body: `tx: ${tx}` };
      } catch (err) {
        console.log('Transaction failed: ', err);
        throw new Error(`Transaction failed: ${err}`);
      }
    });
  },
);
