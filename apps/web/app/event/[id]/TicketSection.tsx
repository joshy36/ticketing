'use client';

import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { RouterOutputs } from 'api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EventCheckout from './EventCheckout';
import { UserProfile } from 'supabase';
import { ChevronLeft, ChevronRight, MinusIcon, PlusIcon } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

// need a better way to share this type between web and mobile
export type Section = {
  created_at: string;
  id: string;
  name: string | null;
  number_of_rows: number | null;
  seats_per_row: number | null;
  updated_at: string | null;
  venue_id: string | null;
};

export default function TicketSection({
  event,
  sections,
  userProfile,
  sectionPrices,
}: {
  event: RouterOutputs['getEventById'];
  sections: Section[];
  userProfile: UserProfile | null | undefined;
  sectionPrices:
    | {
        section_id: string;
        section_name: string | null;
        price: number;
      }[]
    | undefined;
}) {
  const [checkout, setCheckout] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState('');
  const [ticketQuantities, setTicketQuantities] = useState<{
    [id: string]: {
      quantity: number;
      section: Section;
    };
  }>({});

  const createPaymentIntent = trpc.createPaymentIntent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error fetching payment intent ticket:', error);
        alert(`Error!`);
      } else {
        setClientSecret(data?.paymentIntent!);
      }
    },
  });

  const getTotalTicketCount = (): number => {
    return Object.values(ticketQuantities).reduce(
      (total, count) => total + count.quantity,
      0,
    );
  };

  const handleAddTicket = (section: Section) => {
    const totalTickets = getTotalTicketCount();
    if (totalTickets < event?.max_tickets_per_user!) {
      setTicketQuantities((prevQuantities) => ({
        ...prevQuantities,
        [section.id!]: {
          quantity: (prevQuantities[section.id!]?.quantity || 0) + 1,
          section,
        },
      }));
    }
  };

  const handleRemoveTicket = (section: Section) => {
    setTicketQuantities((prevQuantities) => ({
      ...prevQuantities,
      [section.id!]: {
        quantity: Math.max((prevQuantities[section.id!]?.quantity || 0) - 1, 0),
        section,
      },
    }));
  };

  const getTotalPrice = () => {
    let totalPrice = 0;

    Object.keys(ticketQuantities).forEach((id) => {
      const quantity = ticketQuantities[id] || 0;
      const sectionPrice = sectionPrices?.find(
        (sectionPrice) => sectionPrice.section_id === id,
      );

      if (sectionPrice) {
        // @ts-ignore
        totalPrice += quantity.quantity * sectionPrice.price;
      }
    });

    return totalPrice;
  };

  return (
    <div>
      {checkout ? (
        <div>
          <Button
            variant='outline'
            className='pl-1'
            onClick={() => setCheckout(false)}
          >
            <ChevronLeft />
            Back
          </Button>
          <EventCheckout
            event={event!}
            userProfile={userProfile!}
            cart={Object.values(ticketQuantities)}
            totalPrice={getTotalPrice()}
            clientSecret={clientSecret}
          />
        </div>
      ) : (
        <div>
          {sections?.map((section) => (
            <div
              key={section.id}
              className='flex flex-row justify-between py-2'
            >
              <div className='flex flex-col'>
                <div className='text-xl text-white'>{section.name}</div>
                <div className='text font-extralight text-gray-400'>
                  {`$` +
                    sectionPrices?.find(
                      (sectionPrice) => sectionPrice.section_id === section.id,
                    )?.price}
                </div>
              </div>
              <div className='flex flex-row items-center justify-center'>
                <Button
                  // variant='secondary'
                  className='rounded-full'
                  size='icon'
                  onClick={() => {
                    handleRemoveTicket(section);
                  }}
                  disabled={
                    !ticketQuantities[section.id!] ||
                    ticketQuantities[section.id!]?.quantity! <= 0
                  }
                >
                  <MinusIcon />
                </Button>
                <div className='w-8 px-2 text-center text-white'>
                  {ticketQuantities[section.id!]?.quantity || 0}
                </div>
                <Button
                  // variant='secondary'
                  className='rounded-full'
                  size='icon'
                  onClick={() => {
                    handleAddTicket(section);
                  }}
                  disabled={
                    getTotalTicketCount() >= event?.max_tickets_per_user!
                  }
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          ))}
          {getTotalTicketCount() >= event?.max_tickets_per_user! ? (
            <div>
              <div className='text-center text-white'>
                Max {event?.max_tickets_per_user} tickets per user
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <Separator />
          <div className='py-4'>
            <div className='text-xl text-white'>Total: ${getTotalPrice()}</div>
          </div>
          {userProfile ? (
            <Button
              variant='default'
              className='flex w-full'
              disabled={getTotalTicketCount() == 0}
              onClick={() => {
                const filteredCartInfo = Object.values(ticketQuantities).map(
                  (item) => ({
                    quantity: item.quantity,
                    section: {
                      id: item.section.id,
                      name: item.section.name,
                      // stripe_price_id: sectionPrices?.find(
                      //   (price) => price.section_id === item.section.id,
                      // )?.stripe_price_id!,
                    },
                  }),
                );

                createPaymentIntent.mutate({
                  event_id: event?.id!,
                  cart_info: filteredCartInfo,
                  price: getTotalPrice(),
                });
                setCheckout(true);
              }}
            >
              {getTotalTicketCount() === 0 ? (
                'Add tickets above'
              ) : (
                <div className='flex flex-row items-center'>
                  <div>Proceed to Checkout</div>
                  <ChevronRight />
                </div>
              )}
            </Button>
          ) : (
            <Link href={`/sign-in`}>
              <Button variant='default' className='flex w-full'>
                Sign in to Purchase
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
