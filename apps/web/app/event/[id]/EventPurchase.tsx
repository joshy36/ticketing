'use client';

import { Button } from '@/components/ui/button';
import { trpc } from '../../_trpc/client';
import { Events, UserProfile } from 'supabase';
import TicketSection from './TicketSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function EventPurchase({
  userProfile,
  event,
}: {
  userProfile: UserProfile | null | undefined;
  event: Events | null;
}) {
  const {
    data: eventTickets,
    isLoading: loading,
    refetch,
  } = trpc.getAvailableTicketsForEvent.useQuery({
    event_id: event?.id!,
  });

  const { data: sections, isLoading: sectionsLoading } =
    trpc.getSectionsForVenueWithPrices.useQuery({
      id: event?.venue!,
      event_id: event?.id!,
    });

  const renderEventDetails = () => {
    if (!event?.etherscan_link) {
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
            tickets={eventTickets!}
            refetch={refetch}
          />
        </div>
      );
    }
  };

  return <div>{renderEventDetails()}</div>;
}
