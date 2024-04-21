import { NextResponse } from 'next/server';
import { createModularAccountAlchemyClient } from '@alchemy/aa-alchemy';
import { sepolia } from '@alchemy/aa-core';
import { createTurnkeySigner } from '../../../utils/turnkey';

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

// Create a simple async Next.js API route handler
export async function GET() {
  const chain = sepolia;

  const provider = await createModularAccountAlchemyClient({
    apiKey: process.env.ALCHEMY_DEV_API_KEY,
    chain,
    signer: await createTurnkeySigner(),
  });

  return NextResponse.json({ status: 'Done' });
}
