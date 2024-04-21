import {
  TurnkeySigner,
  TurnkeySubOrganization,
} from '@alchemy/aa-signers/src/turnkey';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { http } from 'viem';

export const generateRandomBuffer = (): ArrayBuffer => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return arr.buffer;
};

export const humanReadableDateTime = (): string => {
  return new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '.');
};

export const base64UrlEncode = (challenge: ArrayBuffer): string => {
  return Buffer.from(challenge)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const TURNKEY_BASE_URL = 'https://api.turnkey.com';

export const createTurnkeySigner = async () => {
  let rpId: string;
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
    rpId = 'localhost';
  } else {
    rpId = 'www.jupiter-tickets.com';
  }
  console.log('rpId', rpId);
  const turnkeySigner = new TurnkeySigner({
    apiUrl: TURNKEY_BASE_URL,
    // API Key, WebAuthn, or Email Auth [stampers](https://docs.turnkey.com/category/api-design)
    // must sign all requests to Turnkey.
    stamper: new WebauthnStamper({
      rpId: rpId,
    }),
  });
  console.log('turnkeySigner', turnkeySigner);

  await turnkeySigner.authenticate({
    resolveSubOrganization: async () => {
      return new TurnkeySubOrganization({
        subOrganizationId: '12345678-1234-1234-1234-123456789abc',
        signWith: '0x1234567890123456789012345678901234567890',
      });
    },
    //@ts-ignore
    transport: http(process.env.ALCHEMY_SEPOLIA_URL),
  });

  return turnkeySigner;
};
