'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventTable from './EventTable';
import SendMessage from './SendMessage';
import ManageOrg from './ManageOrg';
import { trpc } from '../../_trpc/client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function DashBoard({ id }: { id: string }) {
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
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='rounded-md' variant='outline' asChild>
            <Link href='artist/create'>Create Artist</Link>
          </Button>
          <Button className='rounded-md' variant='outline' asChild>
            <Link href='venue/create'>Create Venue</Link>
          </Button>
          <Button className='rounded-md' asChild>
            <Link href={`event/create/${id}`}>Create Event</Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue={currentTab || 'events'}>
        <TabsList className='-ml-4'>
          <TabsTrigger
            value='events'
            className='text-sm font-semibold md:text-sm'
            onClick={() => router.push(`?tab=events`)}
          >
            Manage Events
          </TabsTrigger>
          <TabsTrigger
            value='org'
            className='text-sm font-semibold md:text-sm'
            onClick={() => router.push(`?tab=org`)}
          >
            Manage Organization
          </TabsTrigger>
          <TabsTrigger
            value='message'
            className='text-sm font-semibold md:text-sm'
            onClick={() => router.push(`?tab=message`)}
          >
            Send Message
          </TabsTrigger>
        </TabsList>
        <TabsContent value='events'>
          <EventTable events={events} />
        </TabsContent>
        <TabsContent value='org'>
          <ManageOrg organization={organization} />
        </TabsContent>
        <TabsContent value='message'>
          <SendMessage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
