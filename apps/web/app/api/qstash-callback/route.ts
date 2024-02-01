import { NextRequest, NextResponse } from 'next/server';
import {
  VerifySignatureConfig,
  verifySignatureAppRouter,
} from '@upstash/qstash/dist/nextjs';
import { serverClient } from '@/app/_trpc/serverClient';

async function handler(req: NextRequest) {
  console.log('qstash-callback Received message');
  const jobId = await serverClient.getNextJobById.query();
  console.log('qstash-callback jobId: ', jobId);
  if (jobId) {
    serverClient.executeJobFromQueue.mutate({ jobId: jobId });
  }

  return NextResponse.json({ body: 'Success' }, { status: 200 });
}

const config: VerifySignatureConfig = {
  clockTolerance: 10,
};

export const POST = verifySignatureAppRouter(handler, config);
