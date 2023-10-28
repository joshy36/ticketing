import NavBar from '@/components/NavBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import createServerClient from '@/utils/supabaseServer';
import { serverClient } from './_trpc/serverClient';
import Provider from './_trpc/Provider';
import { GeistSans } from 'geist/font';

import './globals.css';
import Footer from '@/components/Footer';
import { MobileNav } from '@/components/MobileNav';

export const revalidate = 0;

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userProfile = null;

  if (session?.user) {
    userProfile = await serverClient.getUserProfile({ id: session.user?.id });
  }

  return (
    <html lang='en' className={GeistSans.className}>
      <body>
        <Provider>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            <NavBar user={session?.user} userProfile={userProfile!} />
            <MobileNav user={session?.user} userProfile={userProfile!} />
            <div className='min-h-screen'> {children}</div>

            <Toaster />
            <Analytics />
            <Footer />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
