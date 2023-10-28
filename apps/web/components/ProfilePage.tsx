'use client';

import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/components/ProfileForm';
import { SidebarNav } from '@/components/SidebarNav';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '../utils/wagmiClient';
import { trpc } from '../../../apps/web/app/_trpc/client';
import UserUploadImage from './UserUploadImage';
import { WalletConnect } from './WalletConnect';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/examples/forms',
  },
  {
    title: 'Account',
    href: '/examples/forms/account',
  },

  {
    title: 'Notifications',
    href: '/examples/forms/notifications',
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
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className=' space-y-6 p-10 pb-16 sm:block'>
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
                  <h3 className='text-lg font-medium'>Profile</h3>
                  <p className='text-sm text-muted-foreground'>
                    This is how others will see you on the site.
                  </p>
                </div>
                <Separator />
                <ProfileForm userProfile={userProfile!} />
                <Separator />
                <h3 className='text-lg font-medium'>Web3 Connection</h3>
                <p className='text-sm text-muted-foreground'>
                  Connect your wallet to custody your tickets! Probably need
                  some better explanation for users.
                </p>
                <Separator />
                <WalletConnect userProfile={userProfile!} />
                <Separator />
                <h3 className='text-lg font-medium'>Profile Picture</h3>
                <Separator />
                <UserUploadImage
                  id={userProfile?.username!}
                  userImage={userProfile?.profile_image}
                  buttonText='Update profile picture'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </WagmiConfig>
  );
}
