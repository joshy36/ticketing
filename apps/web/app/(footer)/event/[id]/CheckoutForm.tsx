import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { Icons } from '~/components/ui/icons';
import { useRouter } from 'next/navigation';
import { Events, UserProfile } from 'supabase';

export default function CheckoutForm({
  userProfile,
  totalPrice,
}: {
  userProfile: UserProfile;
  totalPrice: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/${
          userProfile.username
        }/confirmation`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error?.type === 'card_error' || error?.type === 'validation_error') {
      setMessage(error.message!);
    } else if (error) {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <PaymentElement id='payment-element' />
      <Button
        className='my-6 flex w-full'
        disabled={isLoading || !stripe || !elements}
        id='submit'
      >
        <div className='button-text flex flex-row items-center'>
          <div>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
          </div>
          <div>Purchase ${totalPrice.toFixed(2)}</div>
        </div>
      </Button>
      {/* Show any error or success messages */}
      {message && (
        <div id='payment-message' className='font-light text-red-700'>
          {message}
        </div>
      )}
      <div>
        <p className='text-sm font-extralight text-muted-foreground'>
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
    </form>
  );
}
