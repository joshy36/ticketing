'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { trpc } from '../../../apps/web/app/_trpc/client';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { Events, UserProfile } from 'supabase';
import TicketSection from './TicketSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from './ui/separator';

export default function EventPurchase({
  userProfile,
  event,
}: {
  userProfile: UserProfile | null | undefined;
  event: Events | null;
}) {
  const { data: eventTickets, isLoading: loading } =
    trpc.getTicketsForEvent.useQuery({
      event_id: event?.id!,
    });

  const { data: sections, isLoading: sectionsLoading } =
    trpc.getSectionsForVenue.useQuery({ id: event?.venue! });

  const { data: sectionPrices, isLoading: sectionPricesLoading } =
    trpc.getSectionPriceByEvent.useQuery({ event_id: event?.id! });

  const notPurchasedEventTickets = eventTickets?.filter(
    (x) => x.user_id === null,
  );

  const renderEventDetails = () => {
    if (event?.tickets_remaining === 0) {
      return <h1>Event sold out!</h1>;
    } else if (!event?.etherscan_link) {
      // Don't want to render tickets yet
    } else if (loading) {
      return (
        <div className='flex flex-col space-y-4 pt-2'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Separator />
          <div className='text-xl text-white'>Total: ...</div>
          <Button variant='default' className='flex w-full' disabled={true}>
            Add tickets above
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <TicketSection
            event={event}
            sections={sections!}
            userProfile={userProfile}
            sectionPrices={sectionPrices}
          />
          {/* <DataTable columns={columns} data={notPurchasedEventTickets!} /> */}
        </div>
      );
    }
  };

  return <div className=''>{renderEventDetails()}</div>;
}
