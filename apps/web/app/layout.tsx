import NavBar from '@/components/NavBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import createSupabaseServer from '@/utils/supabaseServer';
import { serverClient } from './_trpc/serverClient';
import Provider from './_trpc/Provider';
import { GeistSans } from 'geist/font';
import Footer from '@/components/Footer';
import { MobileNav } from '@/components/MobileNav';
import { Metadata } from 'next';

import './globals.css';

export const revalidate = 0; //disable cache

export const metadata: Metadata = {
  title: 'Ticketing',
  description: 'This is a ticketing app',
  manifest: '/manifest.json',
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
    data: { session },
  } = await supabase.auth.getSession();

  let userProfile = null;

  if (session?.user) {
    userProfile = await serverClient.getUserProfile.query({
      id: session.user?.id,
    });
  }

  return (
    <html lang='en' className={GeistSans.className}>
      <body>
        <Provider>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            <div className='pb-16'>
              <NavBar user={session?.user} userProfile={userProfile!} />
            </div>
            <MobileNav user={session?.user} userProfile={userProfile!} />
            <div className='min-h-screen'> {children}</div>
            <Toaster />
            <SpeedInsights />
            <Footer />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
