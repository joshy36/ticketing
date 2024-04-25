'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Separator } from '~/components/ui/separator';
import { useEffect, useState } from 'react';
import { RouterOutputs } from 'api';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import EventCheckout from './EventCheckout';
import { UserProfile } from 'supabase';
import { ChevronLeft, ChevronRight, MinusIcon, PlusIcon } from 'lucide-react';
import { trpc } from '~/app/_trpc/client';
import createSupabaseBrowserClient from '~/utils/supabaseBrowser';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// need a better way to share this type between web and mobile
export type Section = {
  created_at: string;
  id: string;
  name: string | null;
  number_of_rows: number | null;
  seats_per_row: number | null;
  updated_at: string | null;
  venue_id: string | null;
  price: number | undefined;
};

export default function TicketSection({
  event,
  sections,
  userProfile,
  tickets,
  refetch,
}: {
  event: RouterOutputs['getEventById'];
  sections: RouterOutputs['getSectionsForVenueWithPrices'];
  userProfile: UserProfile | null | undefined;
  tickets: RouterOutputs['getAvailableTicketsForEvent'];
  refetch: any;
}) {
  const startingSeconds = 600;
  const [seconds, setSeconds] = useState(startingSeconds);
  const [checkout, setCheckout] = useState<boolean>(false);
  const [ticketQuantities, setTicketQuantities] = useState<{
    [id: string]: {
      quantity: number;
      section: Section;
    };
  }>({});
  const [cartInfo, setCartInfo] = useState<
    RouterOutputs['createPaymentIntent'] | undefined
  >(undefined);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    let intervalId: any;

    if (checkout) {
      setSeconds(startingSeconds);
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            deleteReservations.mutate({
              ticket_ids: cartInfo?.ticketReservations.map(
                (ticket) => ticket.ticket_id!,
              )!,
            });

            clearInterval(intervalId); // Stop the interval
            return 0; // Set seconds to 0
          }
        });
      }, 1000);
    }

    // Cleanup interval on component unmount or when countdown is stopped
    return () => clearInterval(intervalId);
  }, [checkout]);

  useEffect(() => {
    const channel = supabase
      .channel('test-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `event_id=eq.${event?.id}`,
        },
        (payload) => {
          refetch();
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets',
          filter: `event_id=eq.${event?.id}`,
        },
        (payload) => {
          refetch();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const createPaymentIntent = trpc.createPaymentIntent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error fetching payment intent ticket:', error);
        toast.error('Not enough tickets left for this tier');
      } else {
        setCartInfo(data);
        setCheckout(true);
      }
    },
  });

  const deleteReservations = trpc.deleteReservationForTickets.useMutation({
    onSettled(error) {
      if (error) {
        console.error('Error deleting reservation:', error);
      } else {
        setCheckout(false);
        // refetch();
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
      const sectionPrice = ticketQuantities[id]?.section.price;

      if (sectionPrice) {
        // @ts-ignore
        totalPrice += quantity.quantity * sectionPrice;
      }
    });

    return totalPrice;
  };

  return (
    <div>
      {checkout ? (
        <div>
          <div className='flex flex-row items-center justify-between'>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant='outline' className='pl-1'>
                  <ChevronLeft />
                  Back
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once you leave this page you will lose the tickets in your
                    cart.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteReservations.mutate({
                        ticket_ids: cartInfo?.ticketReservations.map(
                          (ticket) => ticket.ticket_id!,
                        )!,
                      });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className='flex flex-col'>
              <h1 className='font-light text-muted-foreground'>
                Time Remaining
              </h1>
              <h1 className='flex justify-end text-lg font-semibold'>
                {String(Math.floor(seconds / 60)).padStart(2, '0')}:
                {String(seconds % 60).padStart(2, '0')}
              </h1>
            </div>
          </div>
          <EventCheckout
            event={event!}
            userProfile={userProfile!}
            cart={Object.values(ticketQuantities)}
            totalPrice={getTotalPrice()}
            cartInfo={cartInfo}
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
                <div>
                  {!tickets ||
                  tickets?.filter((ticket) => ticket.section_id === section.id)
                    .length <= 0 ? (
                    <div className='text-red-700'>Sold out</div>
                  ) : (
                    <div>
                      <div className='text font-extralight text-gray-400'>
                        {`$` +
                          tickets?.find(
                            (ticket) => ticket.section_id === section.id,
                          )?.price}
                      </div>
                      <div>
                        {`Amount left: ${
                          (tickets?.filter(
                            (ticket) => ticket.section_id === section.id,
                          ).length || 0) -
                          (ticketQuantities[section.id!]?.quantity || 0)
                        }`}
                      </div>
                    </div>
                  )}
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
                    getTotalTicketCount() >= event?.max_tickets_per_user! ||
                    !tickets ||
                    (tickets?.filter(
                      (ticket) => ticket.section_id === section.id,
                    ).length || 0) -
                      (ticketQuantities[section.id!]?.quantity || 0) <=
                      0
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
            <div className='text-xl text-white'>
              Total: ${getTotalPrice().toFixed(2)}
            </div>
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
                      price: item.section.price,
                    },
                  }),
                );

                createPaymentIntent.mutate({
                  event_id: event?.id!,
                  cart_info: filteredCartInfo,
                  price: getTotalPrice(),
                  user_id: userProfile.id,
                });
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
