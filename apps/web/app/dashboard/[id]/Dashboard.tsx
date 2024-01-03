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

export default async function DashBoard({
  params,
}: {
  params: { id: string };
}) {
  const events = await serverClient.getEventsByOrganization.query({
    organization_id: params.id,
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-row justify-between'>
        <div>
          <h1 className='pb-8 text-4xl font-light'>Manage Events</h1>
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='rounded-md' variant='secondary' asChild>
            <Link href='/event/create'>Create Event</Link>
          </Button>
          <Button className='rounded-md' variant='secondary' asChild>
            <Link href='/artist/create'>Create Artist</Link>
          </Button>
          <Button className='rounded-md' variant='secondary' asChild>
            <Link href='/venue/create'>Create Venue</Link>
          </Button>
        </div>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Name</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className='text-right'>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events?.map((event) => (
            // <Link href='/'>
            <TableRow key={event.id}>
              <TableCell className='font-medium'>{event.name}</TableCell>
              <TableCell>{event.venues.name}</TableCell>
              <TableCell>{event.artists.name}</TableCell>
              <TableCell>{dateToString(event.date)}</TableCell>
              <TableCell className='text-right'>Upcoming</TableCell>
            </TableRow>
            // </Link>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
