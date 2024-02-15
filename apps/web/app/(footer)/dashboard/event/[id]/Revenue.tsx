'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { Events } from 'supabase';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Revenue({ event }: { event: Events }) {
  const revenue = trpc.getRevenueForEvent.useQuery({ event_id: event.id });
  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Earnings for this event.</CardDescription>
      </CardHeader>
      <CardContent>
        {revenue.isLoading ? (
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row justify-between'>
              <p>Total Revenue</p>
              <div>
                <Skeleton className='h-full w-12' />
              </div>
            </div>

            <div className='flex flex-row justify-between'>
              <p>Stripe Fees (2.9% + 30 &cent;)</p>
              <div>
                <Skeleton className='h-full w-12' />
              </div>
            </div>

            <div className='flex flex-row justify-between'>
              <p>Our Fees (5%)</p>
              <div>
                <Skeleton className='h-full w-12' />
              </div>
            </div>
            <Separator />
            <div className='flex flex-row justify-between'>
              <p className='font-bold'>Profit</p>
              <div>
                <Skeleton className='h-full w-12' />
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row justify-between'>
              <p>Total Revenue</p>
              <div>${(revenue.data?.revenue! / 100).toFixed(2)}</div>
            </div>

            <div className='flex flex-row justify-between'>
              <p>Stripe Fees (2.9% + 30 &cent;)</p>
              <div>- ${(revenue.data?.stripeFees! / 100).toFixed(2)}</div>
            </div>

            <div className='flex flex-row justify-between'>
              <p>Our Fees (5%)</p>
              <div>- ${(revenue.data?.ourFees! / 100).toFixed(2)}</div>
            </div>
            <Separator />
            <div className='flex flex-row justify-between'>
              <p className='font-bold'>Profit</p>
              <div className='font-bold'>
                ${(revenue.data?.profit! / 100).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
