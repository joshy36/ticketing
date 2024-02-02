'use client';

import { Button } from '@/components/ui/button';
import {
  base64UrlEncode,
  generateRandomBuffer,
  humanReadableDateTime,
} from '@/utils/turnkey';
import { getWebAuthnAttestation } from '@turnkey/http';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { trpc } from '../../_trpc/client';
import { UserProfile } from 'supabase';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatEthAddress } from '@/utils/helpers';
import CopyWallet from '../CopyWallet';

export default function Turnkey({ userProfile }: { userProfile: UserProfile }) {
  const router = useRouter();

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
      setRpId('jupiter-tickets.vercel.app');
    }
  }, [userProfile]);

  const subOrg = trpc.subOrg.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error creating sub-org:', error);
        setLoading(false);
      } else {
        router.push(`/${userProfile?.username}`);
      }
    },
  });

  const createSubOrg = async () => {
    const challenge = generateRandomBuffer();
    const subOrgName = `Turnkey Viem+Passkey Demo - ${humanReadableDateTime()}`;
    const authenticatorUserId = generateRandomBuffer();

    try {
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
    } catch (e) {
      console.log('rejected', e);
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center pt-24'>
      <Card className='max-w-[400px] rounded-md border'>
        <CardHeader className='text-xl font-bold'>Wallet</CardHeader>
        <CardContent>
          <p className='font-light text-muted-foreground'>
            Your wallet safeguards your digital assets, including tickets and
            collectibles. It is secured by a passkey.
          </p>
          <br />
          {/* <p className='font-light text-muted-foreground'>
            You can find out more about how your private key is stored in a
            secure enclave{' '}
            <Link
              target='_blank'
              href='https://docs.turnkey.com/'
              className='font-light underline underline-offset-4 hover:text-primary'
            >
              here.
            </Link>
          </p> */}

          {walletAddress && (
            <div className='flex flex-row items-center gap-2'>
              <p className=''>Wallet address:</p>
              <CopyWallet userProfile={userProfile} />
            </div>
          )}
          <div className='flex justify-center pt-8'>
            {!subOrgId && (
              <Button
                className='w-full rounded-md hover:bg-gradient-to-r hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700
                hover:text-white'
                onClick={async () => {
                  setLoading(true);
                  await createSubOrg();
                }}
                disabled={loading}
              >
                {loading && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                )}
                <Wallet className='pr-2' />
                Create a wallet
              </Button>
            )}
          </div>
          <p className='pt-4 text-xs font-light text-muted-foreground'>
            <b>Note:</b> If you are on an iPhone you may need to enable iCloud
            Passwords & Keychain under Password &gt; Password Options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
