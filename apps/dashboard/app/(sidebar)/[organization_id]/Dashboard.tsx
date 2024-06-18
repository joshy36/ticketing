'use client';

import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import EventTable from './EventTable';
import { trpc } from '../../_trpc/client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Dashboard({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const { data: events } = trpc.getEventsByOrganization.useQuery({
    organization_id: id,
  });

  const { data: organization } = trpc.getOrganizationById.useQuery({
    organization_id: id,
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-row justify-between'>
        <div>
          <h1 className=' text-4xl font-light'>Dashboard</h1>
          <h3 className='pb-8 text-muted-foreground'>{organization?.name}</h3>
          {/* <ComboboxDemo /> */}
        </div>
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

      <EventTable orgId={id} events={events} />
    </div>
  );
}
