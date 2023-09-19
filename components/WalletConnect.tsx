'use client';

import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from 'wagmi';
import { Button } from './ui/button';
import Image from 'next/image';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export function WalletConnect() {
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
  console.log(connector);

  return (
    <div>
      {isConnected ? (
        <div className="grid grid-cols-2">
          <div className="justify-self-start">
            <Button
              className="w-64"
              variant="secondary"
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect
              {connector?.name === 'MetaMask' ? (
                <Image
                  src="/metamask.png"
                  alt="image"
                  width={500}
                  height={500}
                  className="h-full w-8 object-cover object-center group-hover:opacity-75 pl-2"
                />
              ) : (
                <Image
                  src="/coinbase.png"
                  alt="image"
                  width={200}
                  height={200}
                  className="h-full w-8 object-center group-hover:opacity-75 pl-2"
                />
              )}
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              {ensName
                ? `${ensName} (${address})`
                : address?.substring(0, 6) +
                  '...' +
                  address?.substring(address.length - 4)}
            </h3>
            <p className="text-sm text-muted-foreground">
              Connected to {chain?.name}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {connectors.map((connector) => (
            <Button
              variant="secondary"
              className="justify-self-start w-64"
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
                  src="/metamask.png"
                  alt="image"
                  width={500}
                  height={500}
                  className="h-full w-8 object-cover object-center group-hover:opacity-75 pl-2"
                />
              ) : (
                <Image
                  src="/coinbase.png"
                  alt="image"
                  width={200}
                  height={200}
                  className="h-full w-8 object-center group-hover:opacity-75 pl-2"
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
