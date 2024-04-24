import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import {
  TurnkeySigner,
  TurnkeySubOrganization,
} from '@alchemy/aa-signers/turnkey';
import { http } from 'viem';

const TURNKEY_BASE_URL = 'https://api.turnkey.com';

export const createTurnkeySigner = async (
  subOrganizationId: string,
  signWith: string
) => {
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

  return turnkeySigner;
};
