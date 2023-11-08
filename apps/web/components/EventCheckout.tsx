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
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { UserProfile } from 'supabase';
import { dateToString } from '@/utils/helpers';
import Link from 'next/link';
import { Separator } from './ui/separator';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function EventCheckout({
  ticketId,
  userProfile,
}: {
  ticketId: string;
  userProfile: UserProfile;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();

  const { data: ticket, isLoading: ticketLoading } =
    trpc.getTicketById.useQuery({ id: ticketId });

  const createCheckoutSession = trpc.createCheckoutSession.useMutation({
    onSettled(data) {
      setClientSecret(data?.clientSecret!);
    },
  });

  useEffect(() => {
    if (!ticketLoading) {
      createCheckoutSession.mutate({
        price: ticket?.stripe_price_id!,
        ticket_id: ticketId,
        event_id: data?.event_id!,
        user_id: userProfile.id,
      });
    }
  }, [ticketLoading]);

  const { data, isLoading: loading } = trpc.getTicketById.useQuery({
    id: ticketId,
  });

  const { data: event, isLoading: isLoadingEvent } = trpc.getEventById.useQuery(
    { id: data?.event_id! },
    { enabled: !!data },
  );

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(data?.price));
  return (
    <div className='flex items-center justify-center px-4'>
      <Card className='w-[800px]'>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {loading ? (
            <div></div>
          ) : (
            <CardDescription>
              {`Confirm purchase of ${data?.seat} ticket.`}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div>
            {userProfile.wallet_address ? (
              <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                <div>
                  {event?.image ? (
                    <Image
                      src={event.image}
                      alt={event.description}
                      width={500}
                      height={500}
                      className='rounded-lg'
                    />
                  ) : (
                    <Image
                      src='/fallback.jpeg'
                      alt='image'
                      width={500}
                      height={500}
                      className='rounded-lg'
                    />
                  )}
                  <h1 className='mt-2 text-2xl text-accent-foreground'>
                    {event?.name}
                  </h1>
                  <p className='font-sm text-md mt-0.5 text-muted-foreground'>
                    {`${dateToString(event?.date!)}`}
                  </p>
                  <Separator className='my-6' />
                  <p className='text-sm text-muted-foreground'>
                    By placing an order, you are confirming your acceptance and
                    understanding of our{' '}
                    <Link
                      href='/terms'
                      className='underline underline-offset-4 hover:text-primary'
                    >
                      Terms of Service.
                    </Link>{' '}
                    Please take a moment to review them before proceeding with
                    your purchase.
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
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
