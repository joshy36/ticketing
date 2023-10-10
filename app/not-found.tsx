import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='mt-24 space-y-0.5 text-center'>
      <h1 className='text-4xl font-bold tracking-tight'>Not Found</h1>
      <p>Could not find requested resource</p>
      <Link
        href='/'
        className='underline underline-offset-4 hover:text-primary'
      >
        Return Home
      </Link>
    </div>
  );
}
