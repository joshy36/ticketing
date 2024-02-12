'use client';

import { trpc } from '@/app/_trpc/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Events } from 'supabase';

export default function TicketSales({ event }: { event: Events }) {
  const { data: totalTickets } = trpc.getTicketsForEvent.useQuery({
    event_id: event.id,
  });
  const { data: availableTickets } = trpc.getAvailableTicketsForEvent.useQuery({
    event_id: event.id,
  });
  console.log('totalTickets', totalTickets);
  console.log('availableTickets', availableTickets);
  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Ticket Sales</CardTitle>
        {/* <CardDescription>Earnings for this event.</CardDescription> */}
      </CardHeader>
      <CardContent>
        {availableTickets?.length && totalTickets?.length && (
          <div>
            <Progress
              value={
                ((totalTickets?.length - availableTickets?.length) /
                  totalTickets?.length) *
                100
              }
            />
            <p className='pt-4 text-lg font-bold'>
              {totalTickets?.length - availableTickets?.length} /{' '}
              {totalTickets?.length}
            </p>
            <p>
              {((totalTickets?.length - availableTickets?.length) /
                totalTickets?.length) *
                100}
              % Tickets Sold
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
