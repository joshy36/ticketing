'use client';

import Link from 'next/link';

import { Button } from './ui/button';
import { User } from '@supabase/auth-helpers-nextjs';
import { trpc } from '@/app/_trpc/client';
import { DataTable } from './DataTable';
import { columns } from './Columns';

export default function EventPurchase({
  user,
  event,
}: {
  user: User | null;
  event: Events | null;
}) {
  const { data: eventTickets, isLoading: loading } =
    trpc.getTicketsForEvent.useQuery({
      event_id: event?.id!,
    });

  const notPurchasedEventTickets = eventTickets?.filter(
    (x) => x.user_id === null
  );

  return (
    <div className="py-10">
      {user ? (
        event?.tickets_remaining === 0 ? (
          <Button disabled={true}>Sold Out!</Button>
        ) : (
          <div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="py-6">
                <DataTable columns={columns} data={notPurchasedEventTickets!} />
              </div>
            )}
          </div>
        )
      ) : (
        <Link href={`/sign-in`}>
          <Button>Sign in to Purchase</Button>
        </Link>
      )}
    </div>
  );
}
