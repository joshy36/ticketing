import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import {
  TurnkeySigner,
  TurnkeySubOrganization,
} from '@alchemy/aa-signers/turnkey';
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

export const createTurnkeySigner = async (
  subOrganizationId: string,
  signWith: string,
) => {
  let rpId: string;
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
    rpId = 'localhost';
  } else {
    rpId = 'www.jupiter-tickets.com';
  }
  const stamper = new ApiKeyStamper({
    apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
    apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
  });
  const turnkeySigner = new TurnkeySigner({
    apiUrl: TURNKEY_BASE_URL,
    // API Key, WebAuthn, or Email Auth [stampers](https://docs.turnkey.com/category/api-design)
    // must sign all requests to Turnkey.
    stamper: stamper,
  });
  console.log('turnkeySigner');

  await turnkeySigner.authenticate({
    resolveSubOrganization: async () => {
      return new TurnkeySubOrganization({
        subOrganizationId: subOrganizationId,
        signWith: signWith,
      });
    },
    //@ts-ignore
    transport: http(process.env.ALCHEMY_SEPOLIA_URL),
  });

  console.log('done');

  return turnkeySigner;
};
