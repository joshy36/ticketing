import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/');

  return (
    <div className='flex flex-col items-center justify-center py-20'>demo</div>
  );
}
