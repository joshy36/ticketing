import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function ManageEvent({ id }: { id: string }) {
  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-row justify-between'>
        <div>
          <h1 className='pb-8 text-4xl font-light'>Manage Event</h1>
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='rounded-md' variant='link' asChild>
            <Link href={`/event/${id}`}>
              <div className='flex flex-row items-center gap-2 text-xl font-light'>
                View Event Page <ExternalLink className='h-4 w-4' />
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
