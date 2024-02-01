import { NextRequest, NextResponse } from 'next/server';
import {
  VerifySignatureConfig,
  verifySignatureAppRouter,
} from '@upstash/qstash/dist/nextjs';
import { serverClient } from '@/app/_trpc/serverClient';

async function handler(req: NextRequest) {
  const body = await req.json();
  console.log('qstash-endpoint hit ');
  if (body.job.method === 'transferTicket') {
    console.log('qstash-endpoint Transferring ticket...');
    try {
      const ticket = await serverClient.transferTicket.mutate({
        event_id: body.job.params.event_id,
        ticket_id: body.job.params.ticket_id,
        user_id: body.job.params.user_id,
      });

      await serverClient.finishJob.mutate({
        job: body.jobId,
        hasFailed: false,
      });
    } catch (err) {
      console.log('qstash-endpoint error: ', err);
      await serverClient.finishJob.mutate({
        job: body.jobId,
        hasFailed: true,
      });
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
  return NextResponse.json({ body: 'Success' }, { status: 200 });
}

const config: VerifySignatureConfig = {
  clockTolerance: 10,
};

export const POST = verifySignatureAppRouter(handler, config);
