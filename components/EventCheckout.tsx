'use client';

import { trpc } from '@/app/_trpc/client';
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
  const transferTicket = trpc.transferTicket.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          description: 'Error transferring ticket!',
        });
        console.error('Error transferring ticket:', error);
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
  console.log(data);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(data?.price));
  return (
    <div className="flex items-center justify-center">
      {' '}
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>This will need to be updated</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="mt-1 text-lg font-sm text-accent-foreground text-center">
              Confirm purchase of seat ... for ...
            </p>
          ) : (
            <p className="mt-1 text-lg font-sm text-accent-foreground text-center">
              {`Confirm purchase of seat ${data?.seat} for ${formatted}`}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          {userProfile.wallet_address ? (
            <Button
              onClick={async () => {
                setIsLoading(true);
                // ?? Transfer nft endpoint
                transferTicket.mutate({
                  seat: data?.seat!,
                  event_id: data?.event_id!,
                  user_id: userProfile.id,
                });
              }}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Purchase
            </Button>
          ) : (
            <Button
              onClick={() => router.push(`/user/edit/${userProfile.id}`)}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}

              <p className="underline">
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
