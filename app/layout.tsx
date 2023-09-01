import NavBar from '@/components/NavBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import createServerClient from '@/lib/supabaseServer';
import { serverClient } from './_trpc/serverClient';
import Provider from './_trpc/Provider';

import './globals.css';

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
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = await serverClient.getUserProfile(user?.id);

  return (
    <html lang="en">
      <body>
        <Provider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <NavBar user={user} userProfile={userProfile} />
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
