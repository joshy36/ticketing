'use client';

import { Separator } from '@/components/ui/separator';
import { ProfileForm } from './ProfileForm';
import { SidebarNav } from '../../../../components/SidebarNav';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '@/utils/wagmiClient';
import { trpc } from '../../../_trpc/client';
import UserUploadImage from './UserUploadImage';
import { WalletConnect } from './WalletConnect';
import Turnkey from './Turnkey';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '',
  },
  {
    title: 'Account',
    href: '',
  },
];

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { data: userProfile, isLoading } = trpc.getUserProfile.useQuery({
    username: params.username,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className=' space-y-6 p-10 py-16 sm:block'>
            <div className='space-y-0.5'>
              <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
              <p className='text-muted-foreground'>
                Manage your account settings and set e-mail preferences.
              </p>
            </div>
            <Separator className='my-6' />
            <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
              <aside className='-mx-4 lg:w-1/5'>
                <SidebarNav items={sidebarNavItems} />
              </aside>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-medium'>Wallet</h3>
                  <p className='text-sm text-muted-foreground'>
                    Your wallet safeguards your digital assets, including
                    tickets and collectibles. It is secured by a passkey.
                  </p>
                </div>
                {/* <Separator /> */}
                <Turnkey userProfile={userProfile!} />
                <Separator />
                <div>
                  <h3 className='text-lg font-medium'>Profile Picture</h3>
                  <p className='text-sm text-muted-foreground'>
                    This is how others will see you on the site.
                  </p>
                </div>
                {/* <Separator /> */}
                <UserUploadImage
                  id={userProfile?.id!}
                  userImage={userProfile?.profile_image}
                  buttonText='Update profile picture'
                />
                <Separator />
                <div>
                  <h3 className='text-lg font-medium'>Profile</h3>
                  <p className='text-sm text-muted-foreground'>
                    This is how others will see you on the site.
                  </p>
                </div>
                {/* <Separator /> */}
                <ProfileForm userProfile={userProfile!} />
                <Separator />
                <h3 className='text-lg font-medium'>Web3 Connection</h3>
                <p className='text-sm text-muted-foreground'>
                  Connect your wallet to custody your tickets! Probably need
                  some better explanation for users.
                </p>
                <WalletConnect userProfile={userProfile!} />
              </div>
            </div>
          </div>
        )}
      </div>
    </WagmiConfig>
  );
}
