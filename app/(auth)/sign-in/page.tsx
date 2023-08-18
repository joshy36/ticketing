import { Metadata } from 'next';
import { UserSignInForm } from '@/components/UserSignInForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'User sign in page.',
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in
            </p>
          </div>
          <UserSignInForm />
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{' '}
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up.
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
