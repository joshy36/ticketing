import { dateToString } from '@/utils/helpers';
import { serverClient } from '../../_trpc/serverClient';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Badge } from '@/components/ui/badge';

export default async function DashBoard({ id }: { id: string }) {
  const events = await serverClient.getEventsByOrganization.query({
    organization_id: id,
  });

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Manage Events',
      children: (
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] text-white'>Name</TableHead>
              <TableHead className='text-white'>Venue</TableHead>
              <TableHead className='text-white'>Artist</TableHead>
              <TableHead className='text-white'>Date</TableHead>
              <TableHead className='text-right'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.map((event: any, index: number) => (
              <TableRow
                key={event.id}
                className={index % 2 === 0 ? 'gap-4 bg-black' : 'bg-zinc-950'}
              >
                <TableCell className='font-medium text-white'>
                  {event.name}
                </TableCell>
                <TableCell className='text-white'>
                  {event.venues.name}
                </TableCell>
                <TableCell className='text-white'>
                  {event.artists.name}
                </TableCell>
                <TableCell className='text-white'>
                  {dateToString(event.date)}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='secondary'
                    className='rounded-md text-white'
                    asChild
                  >
                    <Link href={`/dashboard/event/${event.id}`}>
                      Manage
                      <ChevronRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ),
    },
    {
      key: '2',
      label: 'Send Message',
      children: 'Send Message',
    },
  ];

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
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  );
}
