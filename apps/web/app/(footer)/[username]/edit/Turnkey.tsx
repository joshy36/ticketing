'use client';

import { Button } from '~/components/ui/button';
import {
  base64UrlEncode,
  generateRandomBuffer,
  humanReadableDateTime,
} from '~/utils/turnkey';
import { getWebAuthnAttestation } from '@turnkey/http';
import { useEffect, useState } from 'react';
import { Icons } from '~/components/ui/icons';
import { trpc } from '../../../_trpc/client';
import { UserProfile } from 'supabase';
import { revalidatePath } from 'next/cache';
import { Wallet } from 'lucide-react';
import CopyWallet from '../CopyWallet';

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
      setRpId('www.jupiter-tickets.com');
    }
  }, [userProfile]);

  const subOrg = trpc.subOrg.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error creating sub-org:', error);
      } else {
        console.log('sub-org created: ', data);
        setSubOrgId(data?.subOrgId!);
        revalidatePath('/');
      }
    },
  });

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

  return (
    <div>
      {walletAddress && (
        <div className='flex flex-row items-center gap-2'>
          <p className=''>Wallet address:</p>
          <CopyWallet userProfile={userProfile} />
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
            <Wallet className='pr-2' />
            Create a wallet
          </Button>
        )}
      </div>
    </div>
  );
}
