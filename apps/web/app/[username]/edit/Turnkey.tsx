'use client';

import { Button } from '@/components/ui/button';
import {
  base64UrlEncode,
  generateRandomBuffer,
  humanReadableDateTime,
} from '@/utils/turnkey';
import { getWebAuthnAttestation, TurnkeyClient } from '@turnkey/http';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { trpc } from '../../_trpc/client';
import { UserProfile } from 'supabase';

type TPrivateKeyState = {
  id: string;
  address: string;
} | null;

export default function Turnkey({ userProfile }: { userProfile: UserProfile }) {
  const [loading, setLoading] = useState(false);
  const [subOrgId, setSubOrgId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [rp_id, setRpId] = useState<string | null>(null);

  useEffect(() => {
    setSubOrgId(userProfile?.turnkey_sub_org);
    setWalletAddress(userProfile?.wallet_address);
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
      setRpId('localhost');
    } else {
      // setRpId(process.env.NEXT_PUBLIC_BASE_URL!);
      setRpId('ticketing-lemon.vercel.app');
    }
  }, [userProfile]);

  console.log(process.env.NEXT_PUBLIC_ENVIRONMENT);
  console.log('sub_org: ', rp_id);

  const subOrg = trpc.subOrg.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error creating sub-org:', error);
      } else {
        console.log('sub-org created: ', data);
        setSubOrgId(data?.subOrgId!);
      }
    },
  });

  const createKey = trpc.createKey.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error creating key:', error);
      } else {
        console.log('key created: ', data);
        setWalletAddress(data!['address']!);
      }
    },
  });

  const stamper = new WebauthnStamper({
    rpId: rp_id!,
  });

  const passkeyHttpClient = new TurnkeyClient(
    {
      baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
    },
    stamper,
  );

  const createSubOrg = async () => {
    const challenge = generateRandomBuffer();
    const subOrgName = `Turnkey Viem+Passkey Demo - ${humanReadableDateTime()}`;
    const authenticatorUserId = generateRandomBuffer();

    const attestation = await getWebAuthnAttestation({
      publicKey: {
        rp: {
          id: rp_id!,
          name: 'Turnkey Viem Passkey Demo',
        },
        challenge,
        pubKeyCredParams: [
          {
            type: 'public-key',
            // All algorithms can be found here: https://www.iana.org/assignments/cose/cose.xhtml#algorithms
            // Turnkey only supports ES256 at the moment.
            alg: -7,
          },
        ],
        user: {
          id: authenticatorUserId,
          name: subOrgName,
          displayName: subOrgName,
        },
      },
    });

    subOrg.mutate({
      subOrgName: subOrgName,
      attestation,
      challenge: base64UrlEncode(challenge),
    });
  };

  const createPrivateKey = async () => {
    if (!subOrgId) {
      throw new Error('sub-org id not found');
    }

    const signedRequest = await passkeyHttpClient.stampCreatePrivateKeys({
      type: 'ACTIVITY_TYPE_CREATE_PRIVATE_KEYS_V2',
      organizationId: subOrgId,
      timestampMs: String(Date.now()),
      parameters: {
        privateKeys: [
          {
            privateKeyName: `ETH Key ${Math.floor(Math.random() * 1000)}`,
            curve: 'CURVE_SECP256K1',
            addressFormats: ['ADDRESS_FORMAT_ETHEREUM'],
            privateKeyTags: [],
          },
        ],
      },
    });

    createKey.mutate(signedRequest);
  };

  return (
    <div>
      {/* {subOrgId && (
        <div>
          Your sub-org ID: <br />
          <span>{subOrgId}</span>
        </div>
      )} */}
      {walletAddress && (
        <div>
          <p className=''>ETH address:</p>
          <p className='text-muted-foreground'>{walletAddress}</p>
        </div>
      )}
      <div className='flex items-center '>
        {!subOrgId && (
          <Button
            onClick={async () => {
              setLoading(true);
              await createSubOrg();
              setLoading(false);
            }}
            disabled={loading}
          >
            {loading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Create a passkey
          </Button>
        )}
        {subOrgId && !walletAddress && (
          <Button
            onClick={async () => {
              setLoading(true);
              await createPrivateKey();
              setLoading(false);
            }}
            disabled={loading}
          >
            {loading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Create your wallet
          </Button>
        )}
      </div>
    </div>
  );
}
