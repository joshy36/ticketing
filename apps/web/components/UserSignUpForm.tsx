'use client';

import * as React from 'react';

import { cn } from './ui/utils';
import { Icons } from './ui/icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import createClientClient from '@/utils/supabaseClient';
import { useToast } from './ui/use-toast';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSignUpForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = React.useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  // const router = useRouter();

  const supabase = createClientClient();

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    const res = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          username: randomName,
        },
      },
    });
    const id = res.data.user?.id;
    console.log(res);

    if (res.error?.message == 'User already registered') {
      toast({
        variant: 'destructive',
        title: 'User already registered!',
        description: 'There is aleady an account under this email.',
      });
    } else if (
      res.error?.message == 'Password should be at least 6 characters'
    ) {
      toast({
        variant: 'destructive',
        title: 'Password should be at least 6 characters!',
        description: 'Please enter a more secure password.',
      });
    } else {
      setIsSuccessful(true);
      toast({
        title: 'Success! Please check your email for further instructions.',
      });
    }

    // router.refresh();
  };

  // async function onSubmit(event: React.SyntheticEvent) {
  //   event.preventDefault();
  //   setIsLoading(true);

  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000);
  // }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <p>Email</p>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <p>Password</p>
            <Label className='sr-only' htmlFor='password'>
              Password
            </Label>
            <Input
              id='password'
              type='password'
              autoCapitalize='none'
              autoCorrect='off'
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign Up with Email
          </Button>
        </div>
        {isSuccessful ? (
          <div>
            <h1>Success! Please check your email for further instructions.</h1>
          </div>
        ) : (
          <div></div>
        )}
      </form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button> */}
    </div>
  );
}
