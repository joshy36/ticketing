'use client';

import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { dateToString } from '~/utils/helpers';
import { ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { trpc } from '../../_trpc/client';
import { useRouter } from 'next/navigation';

export default function EventTable({ orgId }: { orgId: string }) {
  const router = useRouter();

  const { data: events } = trpc.getEventsByOrganization.useQuery({
    organization_id: orgId,
  });

  return (
    <div>
      <div className='grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='border border-zinc-800 bg-zinc-950'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 36 24'
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
      <div className='grid grid-cols-3 gap-4'>
        {events?.map((event: any, index: number) => (
          <button
            key={event.id}
            className='flex flex-col gap-2 rounded-md border p-4 hover:border-zinc-700 hover:bg-zinc-950'
            onClick={() => router.push(`/${orgId}/event/${event.id}`)}
          >
            <div className='flex flex-row items-center gap-4'>
              <Image
                src={event.image}
                alt='event image'
                width={64}
                height={64}
                className='aspect-square rounded-md'
              />
              <div className='flex flex-col'>
                <p className='text-left text-lg font-semibold'>{event.name}</p>
                <p className='text-left text-sm font-light text-muted-foreground'>
                  {dateToString(event.date)}
                </p>
              </div>
            </div>

            <div className='flex w-full flex-row justify-between'>
              <div className='flex flex-col items-start justify-start'>
                <p className='text-sm font-light text-muted-foreground'>
                  Artist
                </p>
                <div className='flex flex-row items-center gap-2'>
                  {/* <Image
                    src={event.artists.image}
                    alt='event image'
                    width={36}
                    height={36}
                    className='aspect-square rounded-full'
                  /> */}
                  <p className=''>{event.artists.name}</p>
                </div>
              </div>
              <div className='flex flex-col items-start justify-start'>
                <p className='text-sm font-light text-muted-foreground'>
                  Venue
                </p>
                <p className=''>{event.venues.name}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
