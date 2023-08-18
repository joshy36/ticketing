'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import createClientClient from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const supabase = createClientClient();

  const handleSignUp = async () => {
    console.log('sign-up');
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignIn = async () => {
    console.log('sign-in');
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    router.refresh();
    console.log('sign-in2');
  };

  return (
    <>
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Button onClick={handleSignUp}>Sign up</Button>
      <Button onClick={handleSignIn}>Sign in</Button>
    </>
  );
}
