import createSupabaseServer from '~/utils/supabaseServer';
import { serverClient } from './../_trpc/serverClient';
import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';
import NavBar from '../../components/NavBar';
import { SidebarNav } from '../../components/SidebarNav';
import {
  Home,
  User,
  Warehouse,
  SendHorizonal,
  SlidersHorizontal,
} from 'lucide-react';

import './../globals.css';

export const metadata: Metadata = {
  title: 'Ticketing',
  description: 'This is a ticketing app',
};

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile = null;
  let userOrg = null;

  if (user) {
    userProfile = await serverClient.getUserProfile.query({
      id: user?.id,
    });

    if (userProfile) {
      userOrg = await serverClient.getUserOrganization.query({
        user_id: userProfile?.id,
      });
    }
  }

  const sidebarNavItems = [
    {
      title: 'Home',
      href: `/${userOrg}`,
      icon: <Home strokeWidth={1.5} width={18} height={18} />,
    },
    {
      title: 'Artists',
      href: `/${userOrg}/artists`,
      icon: <User strokeWidth={1.5} width={18} height={18} />,
    },
    {
      title: 'Venues',
      href: `/${userOrg}/venues`,
      icon: <Warehouse strokeWidth={1.5} width={18} height={18} />,
    },
    {
      title: 'Send Message',
      href: `/${userOrg}/message`,
      icon: <SendHorizonal strokeWidth={1.5} width={18} height={18} />,
    },
    {
      title: 'Settings',
      href: `/${userOrg}/settings`,
      icon: <SlidersHorizontal strokeWidth={1.5} width={18} height={18} />,
    },
  ];

  return (
    <div>
      <NavBar user={user} userProfile={userProfile!} userOrg={userOrg} />
      <div className='flex flex-col space-y-4 lg:flex-row'>
        <aside className='h-screen border-r px-2 lg:w-1/6'>
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className='w-full px-8 pt-20'>{children}</div>
      </div>
    </div>
  );
}
