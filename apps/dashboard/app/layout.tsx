import { ThemeProvider } from '~/components/ThemeProvider';
import { Toaster } from '~/components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import createSupabaseServer from '~/utils/supabaseServer';
import { serverClient } from './_trpc/serverClient';
import Provider from './_trpc/Provider';
import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';
import NavBar from '../components/NavBar';
import { SidebarNav } from '../components/SidebarNav';
import {
  Home,
  User,
  Warehouse,
  SendHorizonal,
  SlidersHorizontal,
} from 'lucide-react';

import './globals.css';

export const revalidate = 0; //disable cache

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

  return (
    <html lang='en' className={GeistSans.className}>
      <body>
        <Provider>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            <div>{children}</div>
            <Toaster richColors />
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
