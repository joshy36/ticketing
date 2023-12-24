'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

// https://github.com/adueck/pwa-install-demo/blob/badb37b641fb115867fd0b90d54d1cd91eaf22b6/src/App.js#L11

export default function Home() {
  const [installable, setInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event>();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    });
    console.log('installable', installable);
    console.log('deferredPrompt', deferredPrompt);

    window.addEventListener('appinstalled', () => {
      console.log('INSTALL: Success');
    });
  }, []);

  const handleInstallClick = (e: any) => {
    setInstallable(false);
    if (deferredPrompt) {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    }
  };

  return (
    <main>
      <Button className='w-full rounded-none' onClick={handleInstallClick}>
        Install App For Native Experience
      </Button>

      <p className='bg-gradient-to-r from-white to-gray-500 bg-clip-text px-20 py-20 text-center text-4xl font-bold tracking-tighter text-transparent md:text-9xl'>
        Welcome to the future of ticketing.
      </p>
    </main>
  );
}
