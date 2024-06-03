'use client';

import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import EventTable from './EventTable';
import SendMessage from './SendMessage';
import ManageOrg from './ManageOrg';
import { trpc } from '../../../_trpc/client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Artists from './Artists';
import Venues from './Venues';

export default function Dashboard({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const { data: events } = trpc.getEventsByOrganization.useQuery({
    organization_id: id,
  });

  const { data: artists } = trpc.getArtistsByOrganization.useQuery({
    organization_id: id,
  });

  const { data: venues } = trpc.getVenuesByOrganization.useQuery({
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
            Overview
          </TabsTrigger>
          <TabsTrigger
            value='artists'
            className='text-sm font-semibold md:text-sm'
            onClick={() => router.push(`?tab=artists`)}
          >
            Artists
          </TabsTrigger>
          <TabsTrigger
            value='venues'
            className='text-sm font-semibold md:text-sm'
            onClick={() => router.push(`?tab=venues`)}
          >
            Venues
          </TabsTrigger>
          <TabsTrigger
            value='message'
            className='text-sm font-semibold md:text-sm'
            onClick={() => router.push(`?tab=message`)}
          >
            Send Message
          </TabsTrigger>
          <TabsTrigger
            value='org'
            className='text-sm font-semibold md:text-sm'
            onClick={() => router.push(`?tab=org`)}
          >
            Manage Organization
          </TabsTrigger>
        </TabsList>
        <TabsContent value='events'>
          <EventTable events={events} />
        </TabsContent>
        <TabsContent value='artists'>
          <Artists artists={artists} />
        </TabsContent>
        <TabsContent value='venues'>
          <Venues venues={venues} />
        </TabsContent>
        <TabsContent value='message'>
          <SendMessage />
        </TabsContent>
        <TabsContent value='org'>
          <ManageOrg organization={organization} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
