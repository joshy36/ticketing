'use client';

import { ReactQueryOptions, RouterOutputs, trpc } from '@/app/_trpc/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import EventPurchaseButton from './EventPurchaseButton';
import { useRouter } from 'next/navigation';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type TableTicket = {
//   seat: string;
//   price: number;
// };

export type TableTickets = RouterOutputs['getTicketsForEvent'];
type TableTicket = {
  id: string;
  user_id: string | null;
  event_id: string;
  seat: string;
  created_at: string | null;
  price: number;
};

export const columns: ColumnDef<TableTicket>[] = [
  {
    accessorKey: 'seat',
    header: 'Seat',
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'id',
    header: 'Purchase',
    cell: ({ row }) => {
      return <EventPurchaseButton eventId={row.getValue('id')} />;
    },
  },
];
