'use client';

import { trpc } from '../../_trpc/client';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { Events, UserProfile } from 'supabase';
import { Section } from './TicketSection';
import CheckoutForm from './CheckoutForm';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AnimatedGradientBorderTW } from './AnimatedGradientBorderTW';
import { RouterOutputs } from 'api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function EventCheckout({
  event,
  userProfile,
  cart,
  totalPrice,
  cartInfo,
}: {
  event: Events;
  userProfile: UserProfile;
  cart: {
    quantity: number;
    section: Section;
  }[];
  totalPrice: number;
  cartInfo: RouterOutputs['createPaymentIntent'] | undefined;
}) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'usdc'>('card');
  const [clientSecret, setClientSecret] = useState<string | null | undefined>(
    cartInfo?.paymentIntent,
  );
  useEffect(() => {
    setClientSecret(cartInfo?.paymentIntent);
  }, [cartInfo?.paymentIntent]);

  const router = useRouter();

  const { data: sectionPrices, isLoading: priceLoading } =
    trpc.getSectionPriceByEvent.useQuery({ event_id: event.id });

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#000000',
      colorBackground: '#000000',
      colorText: '#ffffff',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className='flex flex-col'>
      <div>
        {userProfile.wallet_address ? (
          <div>
            <div className='py-4 text-2xl font-bold text-white'>Cart</div>
            {/* <Separator className='my-4' /> */}
            {cart!.map((section: any) => (
              <div key={section.section.id}>
                {section.quantity == 0 ? (
                  <div></div>
                ) : (
                  <div className='flex flex-row justify-between'>
                    <div className='flex items-start'>
                      <span className='flex h-6 items-center sm:h-7'>
                        <Badge variant='secondary'>{section.quantity}</Badge>
                        <p className='pl-2'>{section.section.name}</p>
                      </span>
                    </div>
                    <div>
                      <p className='ml-2 text-lg font-extralight'>
                        {`$` +
                          sectionPrices?.find(
                            (sectionPrice) =>
                              sectionPrice.section_name ===
                              section.section.name,
                          )?.price}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Separator className='my-4' />
            <div className='flex flex-row justify-between'>
              <div className='pt-2 text-lg font-semibold'>
                <p>Total:</p>
              </div>
              <div className='pt-2 text-lg font-semibold'>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <Separator className='my-4' />
            <RadioGroup
              defaultValue='card'
              className='grid grid-cols-2 gap-4 py-4'
            >
              <div>
                <RadioGroupItem
                  value='card'
                  id='card'
                  className='peer sr-only'
                  onClick={() => {
                    setPaymentMethod('card');
                  }}
                />
                <Label
                  htmlFor='card'
                  className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='mb-3 h-6 w-6'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                  Credit Card
                </Label>
              </div>
              <div>
                <AnimatedGradientBorderTW>
                  <RadioGroupItem
                    value='usdc'
                    id='usdc'
                    className='peer sr-only'
                    onClick={() => {
                      setPaymentMethod('usdc');
                    }}
                  />
                  <Label
                    htmlFor='usdc'
                    className='flex grow flex-col items-center justify-between rounded-md border-black bg-popover p-4 hover:bg-green-600 hover:bg-opacity-25 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-600 peer-data-[state=checked]:bg-opacity-25 [&:has([data-state=checked])]:border-green-600 [&:has([data-state=checked])]:bg-green-600 [&:has([data-state=checked])]:bg-opacity-25'
                  >
                    <Icons.facebook className='mb-3 h-6 w-6 ' />
                    <p className='pt-1 text-green-600'>USDC</p>
                  </Label>
                </AnimatedGradientBorderTW>
                <p className='pt-2 text-center text-sm font-light text-green-600'>
                  2% discount
                </p>
              </div>
            </RadioGroup>
            <div>
              {paymentMethod === 'usdc' ? (
                <div>Coming soon!</div>
              ) : (
                <div>
                  {clientSecret && (
                    // @ts-ignore
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm event={event} userProfile={userProfile} />
                    </Elements>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center pt-4'>
            <Button
              onClick={() => router.push(`/${userProfile.username}/edit`)}
            >
              <p>Please set up a wallet</p>
              <ExternalLinkIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
