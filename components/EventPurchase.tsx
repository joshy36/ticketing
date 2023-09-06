'use client';

import Link from 'next/link';

import { Button } from './ui/button';
import { User } from '@supabase/auth-helpers-nextjs';
import { trpc } from '@/app/_trpc/client';
import { toast } from './ui/use-toast';
import { Icons } from './ui/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EventPurchase({
  user,
  userProfile,
  event,
}: {
  user: User | null;
  userProfile: UserProfile | null;
  event: Events | null;
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
        router.refresh();
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="py-10">
      {user ? (
        <Button
          onClick={async () => {
            setIsLoading(true);
            transferTicket.mutate({
              seat: 'GA',
              event_id: event?.id!,
              user_id: userProfile?.id!,
            });
          }}
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Purchase
        </Button>
      ) : (
        <Link href={`/sign-in`}>
          <Button>Sign in to Purchase</Button>
        </Link>
      )}
    </div>
  );
}
