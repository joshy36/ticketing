'use client';

import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from 'wagmi';
import { Button } from '~/components/ui/button';
import Image from 'next/image';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import React from 'react';
import { useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem';
import { trpc } from '../../../_trpc/client';
import { UserProfile } from 'supabase';
import { formatEthAddress } from '~/utils/helpers';

export function WalletConnect({ userProfile }: { userProfile: UserProfile }) {
  const {
    connect,
    connectors,
    error,
    isLoading: isLoadingWallet,
    pendingConnector,
  } = useConnect();
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  // const [recoveredAddress, setRecoveredAddress] = React.useState<string>('');
  // const recoveredAddress = React.useRef<string>();
  const {
    data: signMessageData,
    error: signMessageError,
    isLoading,
    signMessage,
    variables,
  } = useSignMessage();

  // const updateWallet = trpc.updateUser.useMutation({
  //   onSettled(data, error) {
  //     if (!data) {
  //       console.error('Error adding wallet:', error);
  //     }
  //   },
  // });

  React.useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        });
        if (recoveredAddress === address) {
          // updateWallet.mutate({
          //   id: userProfile.id,
          //   wallet_address: String(recoveredAddress),
          // });
        } else {
          console.error('Signature did not recover to correct address');
        }
      }
    })();
  }, [
    signMessageData,
    variables?.message,
    address,
    // updateWallet,
    userProfile.id,
  ]);

  return (
    <div>
      {isConnected ? (
        <div className='grid grid-cols-2'>
          <div className='justify-self-start'>
            <div className='py-4'>
              {' '}
              <Button
                disabled={isLoading}
                variant='secondary'
                onClick={() =>
                  signMessage({
                    message:
                      'Please sign this message to confirm this is your wallet',
                  })
                }
              >
                {isLoading ? 'Check Wallet' : 'Sign Message'}
              </Button>
              {signMessageError && <div>{signMessageError.message}</div>}
            </div>

            <Button
              className='w-64'
              variant='secondary'
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect
              {connector?.name === 'MetaMask' ? (
                <Image
                  src='/metamask.png'
                  alt='image'
                  width={500}
                  height={500}
                  className='h-full w-8 object-cover object-center pl-2 group-hover:opacity-75'
                />
              ) : (
                <Image
                  src='/coinbase.png'
                  alt='image'
                  width={200}
                  height={200}
                  className='h-full w-8 object-center pl-2 group-hover:opacity-75'
                />
              )}
            </Button>
          </div>
          <div>
            <h3 className='text-lg font-medium'>
              {ensName ? `${ensName} (${address})` : formatEthAddress(address!)}
            </h3>
            <p className='text-sm text-muted-foreground'>
              Connected to {chain?.name}
            </p>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4'>
          {connectors.map((connector) => (
            <Button
              variant='secondary'
              className='w-64 justify-self-start'
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                if (chain?.id != 8453) {
                  console.log('No!');
                  switchNetwork?.(8453);
                }
                connect({ connector });
              }}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoadingWallet &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
              {connector.name === 'MetaMask' ? (
                <Image
                  src='/metamask.png'
                  alt='image'
                  width={500}
                  height={500}
                  className='h-full w-8 object-cover object-center pl-2 group-hover:opacity-75'
                />
              ) : (
                <Image
                  src='/coinbase.png'
                  alt='image'
                  width={200}
                  height={200}
                  className='h-full w-8 object-center pl-2 group-hover:opacity-75'
                />
              )}
            </Button>
          ))}
          {error && <div>{error.message}</div>}
        </div>
      )}
    </div>
  );
}
