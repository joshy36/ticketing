import Link from 'next/link';

export default function Unauthenticated() {
  return (
    <div className='mt-24 space-y-0.5 text-center'>
      <h1 className='text-4xl font-bold tracking-tight'>Unauthenticated</h1>
      <p className='text-muted-foreground'>
        Sorry, you must be signed in to view this page!
      </p>
      <Link
        href='/sign-in'
        className='underline underline-offset-4 hover:text-primary'
      >
        Sign in.
      </Link>
    </div>
  );
}
