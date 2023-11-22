'use client';

import { trpc } from '../../../apps/web/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { Events, UserProfile } from 'supabase';
import Link from 'next/link';
import { Section } from './TicketSection';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function EventCheckout({
  event,
  userProfile,
  ticketQuantities,
  totalPrice,
}: {
  event: Events;
  userProfile: UserProfile;
  ticketQuantities: {
    quantity: number;
    section: Section;
  }[];
  totalPrice: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();

  const { data: sectionPrices, isLoading: priceLoading } =
    trpc.getSectionPriceByEvent.useQuery({ event_id: event.id });

  console.log(sectionPrices);
  const createCheckoutSession = trpc.createCheckoutSession.useMutation({
    onSettled(data) {
      setClientSecret(data?.clientSecret!);
    },
  });

  useEffect(() => {
    const filteredCartInfo = ticketQuantities.map((item) => ({
      quantity: item.quantity,
      section: {
        id: item.section.id,
        name: item.section.name,
        stripe_price_id: sectionPrices?.find(
          (price) => price.section_id === item.section.id,
        )?.stripe_price_id!,
      },
    }));

    console.log(filteredCartInfo);

    createCheckoutSession.mutate({
      cart_info: filteredCartInfo,
      event_id: event.id,
      user_id: userProfile.id,
    });
  }, []);

  return (
    <div className='flex flex-col  '>
      <div className='py-4 text-left text-2xl font-bold'>Checkout</div>
      <div>
        {userProfile.wallet_address ? (
          <div>
            <div>
              <p className='pb-4 text-sm text-muted-foreground'>
                By placing an order, you are confirming your acceptance and
                understanding of our{' '}
                <Link
                  href='/terms'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Terms of Service.
                </Link>{' '}
                Please take a moment to review them before proceeding with your
                purchase.
              </p>
            </div>
            <div>
              {clientSecret && (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </div>
          </div>
        ) : (
          <Button
            onClick={() => router.push(`/${userProfile.username}/edit`)}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}

            <p>Please Connect Wallet in Profile Section</p>
            <ExternalLinkIcon />
          </Button>
        )}
      </div>

      {/* <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter> */}
    </div>
  );
}
