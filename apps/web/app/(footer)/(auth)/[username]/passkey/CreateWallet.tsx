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
import { trpc } from '../../../../_trpc/client';
import { UserProfile } from 'supabase';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatEthAddress } from '@/utils/helpers';
import CopyWallet from '../CopyWallet';
import confetti from 'canvas-confetti';

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
      setRpId('www.jupiter-tickets.com');
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

  useEffect(() => {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: any, max: any) {
      return Math.random() * (max - min) + min;
    }

    var interval: any = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 500);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center pt-24'>
      <h1 className='bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text pb-16 text-4xl font-bold text-transparent md:pr-4 lg:pr-8 lg:text-7xl'>
        Welcome to Jupiter!
      </h1>
      <Card className='mb-32 max-w-[400px] rounded-md border'>
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
                className='w-full rounded-md'
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
