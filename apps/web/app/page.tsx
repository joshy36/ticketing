'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

// https://github.com/adueck/pwa-install-demo/blob/badb37b641fb115867fd0b90d54d1cd91eaf22b6/src/App.js#L11
let deferredPrompt: any;

export default function Home() {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      setInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      // Log install to analytics
      console.log('INSTALL: Success');
    });
  }, []);

  const handleInstallClick = (e: any) => {
    // Hide the app provided install promotion
    setInstallable(false);
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };
  return (
    <main>
      {installable && (
        <Button className='w-full rounded-none' onClick={handleInstallClick}>
          Install App For Native Experience
        </Button>
      )}
      <p className='bg-gradient-to-r from-white to-gray-500 bg-clip-text px-20 py-20 text-center text-4xl font-bold tracking-tighter text-transparent md:text-9xl'>
        Welcome to the future of ticketing.
      </p>
    </main>
  );
}
