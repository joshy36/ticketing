'use client';

import * as React from 'react';

import { cn } from '~/components/ui/utils';
import { Icons } from '~/components/ui/icons';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '~/utils/supabaseBrowser';
import { toast } from 'sonner';
import { trpc } from '~/app/_trpc/client';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSignInForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const supabase = createSupabaseBrowserClient();

  const signIn = trpc.signIn.useMutation({
    onSettled(error) {
      setIsLoading(false);

      if (error) {
        console.error('Error signing in:', error);
        toast.error('Invalid login credentials', {
          description: 'Forgot your password? Do something here',
        });
      } else {
        router.push('/');
        router.refresh();
      }
    },
  });

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    signIn.mutate({ email, password });
  };

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
              className='rounded-full'
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
              className='rounded-full'
            />
          </div>
          <Button disabled={isLoading} className='rounded-full'>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign In with Email
          </Button>
        </div>
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
