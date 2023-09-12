'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function EventPurchaseButton({ eventId }: { eventId: string }) {
  const router = useRouter();

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => router.push(`/event/checkout/${eventId}`)}
      >
        Purchase
      </Button>
    </div>
  );
}
