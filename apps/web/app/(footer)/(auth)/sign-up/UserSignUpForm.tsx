'use client';

import * as React from 'react';

import { cn } from '@/components/ui/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import createSupabaseBrowserClient from '@/utils/supabaseBrowser';
import { toast } from 'sonner';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { trpc } from '@/app/_trpc/client';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSignUpForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = React.useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const router = useRouter();

  const supabase = createSupabaseBrowserClient();

  const generatePfp = trpc.generatePfpForUser.useMutation({
    onSettled(error) {
      if (error) {
        console.error('Error deleting reservation:', error);
      }
    },
  });

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    // maybe need to check if username is taken?
    const res = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${location.origin}/auth/confirm`,
        data: {
          username: randomName,
        },
      },
    });
    const id = res.data.user?.id;
    console.log(res);

    if (res.error?.message == 'User already registered') {
      toast.error('User already registered', {
        description: 'There is aleady an account under this email',
      });
    } else if (
      res.error?.message == 'Password should be at least 6 characters'
    ) {
      toast.error('Password should be at least 6 characters', {
        description: 'Please enter a more secure password',
      });
    } else {
      setIsSuccessful(true);
      toast.success(
        'Success! Please check your email for further instructions',
      );

      if (id) {
        generatePfp.mutate({
          id: id,
          prompt: randomName,
        });
      }
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
        <div className='grid gap-4'>
          <div className='grid gap-1'>
            <p>Email</p>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
            ></meta>
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
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
            ></meta>
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
          <Button disabled={isLoading} className='rounded-md'>
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
    </div>
  );
}
