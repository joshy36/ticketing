import { serverClient } from '../../_trpc/serverClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import EventTable from './EventTable';
import SendMessage from './SendMessage';
import { Separator } from '@radix-ui/react-dropdown-menu';

export default async function DashBoard({ id }: { id: string }) {
  const events = await serverClient.getEventsByOrganization.query({
    organization_id: id,
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-row justify-between'>
        <div>
          <h1 className='pb-8 text-4xl font-light'>Dashboard</h1>
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='rounded-md' variant='outline' asChild>
            <Link href='/artist/create'>Create Artist</Link>
          </Button>
          <Button className='rounded-md' variant='outline' asChild>
            <Link href='/venue/create'>Create Venue</Link>
          </Button>
          <Button className='rounded-md' asChild>
            <Link href='/event/create'>Create Event</Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue='events'>
        <TabsList className='-ml-4'>
          <TabsTrigger value='events'>Manage Events</TabsTrigger>
          <TabsTrigger value='org'>Manage Organization</TabsTrigger>
          <TabsTrigger value='message'>Send Message</TabsTrigger>
        </TabsList>
        {/* <Separator /> */}
        <TabsContent value='events'>
          <EventTable events={events} />
        </TabsContent>
        <TabsContent value='org'>Change your password here.</TabsContent>
        <TabsContent value='message'>
          <SendMessage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
