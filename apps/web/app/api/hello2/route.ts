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
    signer: await createTurnkeySigner(
      '8708fc86-59c7-4e92-b609-54e3cb1a521c',
      '0x3b09bB200d53599f0840B9B5A49b27c9c5e3eFEB',
    ),
  });

  console.log(provider.account.address);
  // const factory = await provider.account.getFactoryAddress();
  // console.log(factory);

  return NextResponse.json({ status: 'Done' });
}
