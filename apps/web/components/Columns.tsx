'use client';

import { RouterOutputs } from '../../../apps/web/app/_trpc/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MinusCircle } from 'lucide-react';
import { Button } from './ui/button';
import EventPurchaseButton from './EventPurchaseButton';
import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

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
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'id',
    header: 'Purchase',
    cell: ({ row }) => {
      const [amount, setAmount] = useState(0);
      return (
        // <div className='grid grid-cols-3 '>
        //   <Button
        //     className='justify-self-center'
        //     variant='ghost'
        //     size='icon'
        //     onClick={() => setAmount(amount - 1)}
        //     disabled={amount <= 0}
        //   >
        //     <MinusCircledIcon className='h-8 w-8' />
        //   </Button>
        //   <div className='text-center align-middle font-bold'>{amount}</div>
        <EventPurchaseButton eventId={row.getValue('id')} />
        //    <Button
        //     className='justify-self-center'
        //     variant='ghost'
        //     size='icon'
        //     onClick={() => setAmount(amount + 1)}
        //   >
        //     <PlusCircledIcon className='h-8 w-8' />
        //   </Button>
        // </div>
      );
    },
  },
];
