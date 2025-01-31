import { Metadata } from 'next';
import { UserSignUpForm } from './UserSignUpForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'User sign up page.',
};

export default function AuthenticationPage() {
  return (
    <div className='px-4 pt-16'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Create an account
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email below to create your account
          </p>
        </div>
        <UserSignUpForm />
        <p className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/sign-in'
            className='underline underline-offset-4 hover:text-primary'
          >
            Sign in.
          </Link>
        </p>
        <p className='px-8 text-center text-sm text-muted-foreground'>
          By clicking continue, you agree to our{' '}
          <Link
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
