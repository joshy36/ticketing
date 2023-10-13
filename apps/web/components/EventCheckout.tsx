'use client';

import { trpc } from '../../../apps/web/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

export default function EventCheckout({
  ticketId,
  userProfile,
}: {
  ticketId: string;
  userProfile: UserProfile;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const sellTicket = trpc.sellTicket.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          description: 'Error selling ticket!',
        });
        console.error('Error selling ticket:', error);
        setIsLoading(false);
      } else {
        router.push(`/user/${userProfile.id}`);
        setIsLoading(false);
      }
    },
  });
  const { data, isLoading: loading } = trpc.getTicketById.useQuery({
    id: ticketId,
  });

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(data?.price));
  return (
    <div className='flex items-center justify-center'>
      {' '}
      <Card className='w-[500px]'>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>This will need to be updated</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='font-sm mt-1 text-center text-lg text-accent-foreground'>
              Confirm purchase of seat ... for ...
            </p>
          ) : (
            <div>
              <p className='font-sm mt-1 text-center text-lg text-accent-foreground'>
                {`Confirm purchase of seat ${data?.seat} for ${formatted}`}
              </p>
              <div>
                {isLoading && (
                  <p className='text-muted-foreground'>
                    This may take a few seconds as your ticket is being
                    transferred and the transaction is confimed on chain
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
          {userProfile.wallet_address ? (
            <Button
              onClick={async () => {
                setIsLoading(true);
                sellTicket.mutate({
                  ticket_id: ticketId,
                  event_id: data?.event_id!,
                  user_id: userProfile.id,
                });
              }}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Purchase
            </Button>
          ) : (
            <Button
              onClick={() => router.push(`/user/edit/${userProfile.id}`)}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}

              <p className='underline'>
                Please Connect Wallet in Profile Section
              </p>
              <ExternalLinkIcon />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
