import { ThemeProvider } from '~/components/ThemeProvider';
import { Toaster } from '~/components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import Provider from './_trpc/Provider';
import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';

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
