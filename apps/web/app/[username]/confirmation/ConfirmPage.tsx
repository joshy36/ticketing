'use client';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import router from 'next/router';
import { useEffect } from 'react';

export default function ConfirmPage({ username }: { username: string }) {
  const searchParams = useSearchParams();
  // params from stripe
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get(
    'payment_intent_client_secret',
  );
  const redirectStatus = searchParams.get('redirect_status');
  if (!paymentIntent || !paymentIntentClientSecret || !redirectStatus) {
    notFound();
  }
  const paymentIntentFull = trpc.getStripePaymentIntent.useQuery({
    paymentIntent: paymentIntent,
  });

  console.log(paymentIntentFull.data?.metadata);

  useEffect(() => {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: any, max: any) {
      return Math.random() * (max - min) + min;
    }

    var interval: any = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 500);
  }, []);

  return (
    <div className='flex justify-center pt-20'>
      {paymentIntentFull.isLoading ||
      paymentIntentFull.data?.status === 'processing' ? (
        <Card className='flex flex-col items-center justify-center'>
          <p className='text-4xl font-bold'>Confirming purchase...</p>
          <p className='pb-8 text-muted-foreground'>
            This should only take a few seconds.
          </p>
          <div>
            <Icons.spinner className='mr-2 h-8 w-8 animate-spin' />
          </div>
        </Card>
      ) : (
        <div>
          {paymentIntentFull.data?.status === 'succeeded' ? (
            <Card className='flex flex-col items-center justify-center border border-muted-foreground p-8'>
              <CardContent>
                <div className='flex flex-row gap-4'>
                  <p className='pb-8 text-4xl font-bold'>Order Confirmed!</p>
                  <CheckCircle2 className='h-8 w-8 text-green-600' />
                </div>

                {JSON.parse(paymentIntentFull.data?.metadata.cart_info!).map(
                  (section: any) => (
                    <div key={section.section.id}>
                      {section.quantity == 0 ? (
                        <div></div>
                      ) : (
                        <div className='flex flex-row justify-between'>
                          <div className='flex items-start'>
                            <span className='flex h-6 items-center sm:h-7'>
                              <Badge variant='secondary'>
                                {section.quantity}
                              </Badge>
                              <p className='pl-2'>{section.section.name}</p>
                            </span>
                          </div>
                          <div>
                            <p className='ml-2 text-lg font-extralight'>
                              {`$` + section.section.price}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                )}
                <Separator className='my-2' />
                <div className='flex flex-row justify-between'>
                  <div className='pt-2 text-lg font-semibold'>
                    <p>Total:</p>
                  </div>
                  <div className='pt-2 text-lg font-semibold'>
                    <p>${(paymentIntentFull.data?.amount! / 100).toFixed(2)}</p>
                  </div>
                </div>

                <div className='flex justify-center'>
                  <Link href={`/${username}/tickets`}>
                    <Button variant='outline' className='mt-8 px-8'>
                      View Tickets
                      <ChevronRightIcon />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <div className='flex flex-row gap-4'>
                <p className='pb-8 text-4xl font-bold'>
                  Order Failed! Please try again.
                </p>
                <XCircle className='h-8 w-8 text-red-600' />
              </div>
              <Link href={`/event/list`}>
                <Button variant='outline' className='px-8'>
                  <ChevronLeftIcon />
                  Back to events
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
