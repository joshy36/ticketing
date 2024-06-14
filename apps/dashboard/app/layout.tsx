import NavBar from '~/components/NavBar';
import { ThemeProvider } from '~/components/ThemeProvider';
import { Toaster } from '~/components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import createSupabaseServer from '~/utils/supabaseServer';
import { serverClient } from './_trpc/serverClient';
import Provider from './_trpc/Provider';
import { GeistSans } from 'geist/font/sans';
import { MobileNav } from '~/components/MobileNav';
import { Metadata } from 'next';

import './globals.css';
import { redirect } from 'next/navigation';

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

  return (
    <html lang='en' className={GeistSans.className}>
      <body>
        <Provider>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            {/* <MessagesProvider userProfile={userProfile}>
              <TicketsProvider userProfile={userProfile}>
                <FriendRequestProvider> */}
            <div>{children}</div>
            <Toaster richColors />
            <SpeedInsights />
            <Analytics />
            {/* </FriendRequestProvider>
              </TicketsProvider>
            </MessagesProvider> */}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
