import { NextRequest, NextResponse } from 'next/server';
import {
  VerifySignatureConfig,
  verifySignatureAppRouter,
} from '@upstash/qstash/dist/nextjs';
import { executeNextJob } from 'api/src/job-queue/utils';

async function handler(req: NextRequest) {
  console.log('qstash-callback Received message');
  // instead of get next job and then execute should be a executeNextJOb for concurency

  executeNextJob();

  return NextResponse.json({ body: 'Success' }, { status: 200 });
}

const config: VerifySignatureConfig = {
  clockTolerance: 10,
};

export const POST = verifySignatureAppRouter(handler, config);
