import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { dateToString } from '~/utils/helpers';
import { ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function EventTable({ events }: { events: any }) {
  return (
    <div>
      <div className='grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='border border-zinc-800 bg-zinc-950'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-green-600'
            >
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$45,231.89</div>
            <p className='text-xs text-muted-foreground'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className='border border-zinc-800 bg-zinc-950'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Fans</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-blue-800'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+2350</div>
            <p className='text-xs text-muted-foreground'>
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className='border border-zinc-800 bg-zinc-950'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sales</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <rect width='20' height='14' x='2' y='5' rx='2' />
              <path d='M2 10h20' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+12,234</div>
            <p className='text-xs text-muted-foreground'>
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card className='border border-zinc-800 bg-zinc-950'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active This Month
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-orange-700'
            >
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+573</div>
            <p className='text-xs text-muted-foreground'>
              +201 since last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {events?.map((event: any, index: number) => (
          <div
            key={event.id}
            className='rounded-md border bg-zinc-950 p-4 hover:bg-zinc-900'
          >
            <div className='flex flex-row items-center gap-2'>
              <Image
                src={event.image}
                alt='event image'
                width={48}
                height={48}
                className='aspect-square rounded-md'
              />
              <div className='flex flex-col'>
                <p className='text-lg font-semibold'>{event.name}</p>
                <p className='text-sm font-light text-muted-foreground'>
                  {dateToString(event.date)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='text-muted-foreground'>Name</TableHead>
            <TableHead className='text-muted-foreground'>Venue</TableHead>
            <TableHead className='text-muted-foreground'>Artist</TableHead>
            <TableHead className='text-muted-foreground'>Date</TableHead>
            <TableHead className='text-right'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events?.map((event: any, index: number) => (
            <TableRow
              key={event.id}
              className={index % 2 === 0 ? 'gap-4 bg-black' : 'bg-zinc-950'}
            >
              <TableCell className='font-medium'>
                {
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={event.image}
                      alt='event image'
                      width={48}
                      height={48}
                      className='aspect-square rounded-md'
                    />
                    <p>{event.name}</p>
                  </div>
                }
              </TableCell>
              <TableCell>{event.venues.name}</TableCell>
              <TableCell>{event.artists.name}</TableCell>
              <TableCell>{dateToString(event.date)}</TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='secondary'
                  className='rounded-md text-white'
                  asChild
                >
                  <Link href={`/event/${event.id}`}>
                    Manage
                    <ChevronRight />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
