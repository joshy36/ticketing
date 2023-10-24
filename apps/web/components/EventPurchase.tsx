'use client';

import Link from 'next/link';

import { Button } from './ui/button';
import { User } from '@supabase/auth-helpers-nextjs';
import { trpc } from '../../../apps/web/app/_trpc/client';
import { DataTable } from './DataTable';
import { columns } from './Columns';

export default function EventPurchase({
  user,
  event,
}: {
  user: User | undefined;
  event: Events | null;
}) {
  const { data: eventTickets, isLoading: loading } =
    trpc.getTicketsForEvent.useQuery({
      event_id: event?.id!,
    });

  const notPurchasedEventTickets = eventTickets?.filter(
    (x) => x.user_id === null,
  );

  const renderEventDetails = () => {
    if (event?.tickets_remaining === 0) {
      return <h1>Event sold out!</h1>;
    } else if (!event?.etherscan_link) {
      // Don't want to render tickets yet
    } else if (loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className='py-6'>
          <DataTable columns={columns} data={notPurchasedEventTickets!} />
        </div>
      );
    }
  };

  const renderContent = () => {
    if (user) {
      return renderEventDetails();
    } else {
      return (
        <Link href='/sign-in'>
          <Button>Sign in to Purchase</Button>
        </Link>
      );
    }
  };

  return <div className='py-10'>{renderContent()}</div>;
}
