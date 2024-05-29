'use client';

import { Button } from '~/components/ui/button';
import { dateToString } from '~/utils/helpers';
import { ArrowLeft, ExternalLink, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Events, Organization } from 'supabase';
import { useRouter } from 'next/navigation';
import { Separator } from '~/components/ui/separator';
import Scanners from './Scanners';
import Revenue from './Revenue';
import TicketSales from './TicketSales';
import Release from './Release';

export default function ManageEvent({
  event,
  organization,
}: {
  event: Events;
  organization: Organization | null;
}) {
  const router = useRouter();

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-row justify-between'>
        <div>
          <h1 className=' text-4xl font-light'>Dashboard</h1>
          <h3 className='pb-8 text-muted-foreground'>{organization?.name}</h3>
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='rounded-md' variant='link' asChild>
            <Link href={`/event/${event.id}`}>
              <div className='flex flex-row items-center gap-2 text-xl font-light text-muted-foreground hover:text-white'>
                View Event Page <ExternalLink className='h-4 w-4' />
              </div>
            </Link>
          </Button>
        </div>
      </div>

      <Button
        variant='link'
        className='my-1 -ml-4 rounded-md'
        onClick={() => router.push(`/dashboard/${organization?.id}`)}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Main Dashboard
      </Button>
      <Separator />

      <h3 className='pt-4 text-2xl font-light'>Manage Event - {event.name}</h3>
      <h4 className='font-light text-muted-foreground'>
        {dateToString(event.date)}
      </h4>
      <div className='flex flex-col gap-0 md:flex-row md:gap-4'>
        <TicketSales event={event} />
        <Revenue event={event} />
      </div>

      <Scanners event={event} />
      <Release event={event} />
    </div>
  );
}
