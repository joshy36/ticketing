'use client';

import { trpc } from '~/app/_trpc/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Events } from 'supabase';
import { Skeleton } from '~/components/ui/skeleton';

export default function ScannedIn({ event }: { event: Events }) {
  const { data: totalTickets, isLoading: totalTicketsLoading } =
    trpc.getTicketsForEvent.useQuery({
      event_id: event.id,
    });
  const { data: scannedIn, isLoading: scannedInLoading } =
    trpc.getScannedInUsersForEvent.useQuery({ event_id: event.id });

  return (
    <Card className='mt-4 w-full rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Scanned In Users</CardTitle>
        {/* <CardDescription>Earnings for this event.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div>
          {totalTicketsLoading && scannedInLoading && (
            <div>
              <Progress value={0} />
              <Skeleton className='mt-4 h-6 w-12' />
              <Skeleton className='mt-3 h-4 w-20' />
            </div>
          )}
          {scannedIn?.length && totalTickets?.length && (
            <div>
              <Progress
                value={(scannedIn?.length / totalTickets?.length) * 100}
              />
              <p className='pt-4 text-lg font-bold'>
                {scannedIn?.length} / {totalTickets?.length}
              </p>
              <p>
                {((scannedIn?.length / totalTickets?.length) * 100).toFixed(1)}%
                Users Scanned In
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
