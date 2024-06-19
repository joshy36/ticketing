'use client';

import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import EventTable from './EventTable';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Dashboard({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  return (
    <div className=''>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-2'>
          <Button className='rounded-md' variant='outline' asChild>
            <Link href={`${id}/artist/create`}>Create Artist</Link>
          </Button>
          <Button className='rounded-md' variant='outline' asChild>
            <Link href={`${id}/venue/create`}>Create Venue</Link>
          </Button>
          <Button className='rounded-md' asChild>
            <Link href={`event/create/${id}`}>Create Event</Link>
          </Button>
        </div>
      </div>

      <EventTable orgId={id} />
    </div>
  );
}
