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

export default function Revenue({ event }: { event: Events }) {
  const { data: sections, isLoading: sectionsLoading } =
    trpc.getSectionsForVenue.useQuery({ id: event?.venue! });

  const { data: sectionPrices, isLoading: sectionPricesLoading } =
    trpc.getSectionPriceByEvent.useQuery({ event_id: event?.id! });

  console.log('sections', sections);
  console.log('sectionPrices', sectionPrices);
  if (sectionsLoading || sectionPricesLoading) {
    return <div>Loading...</div>; // or a loading indicator
  }

  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Earnings for this event.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p>Total Revenue</p>
          <p>Stripe Fees (2.9% + 30 &cent;)</p>
          <p>Our Fees (10%)</p>
          <Separator />
          <p>Profit</p>
          {sections?.map((section) => {
            return (
              <div key={section.id}>
                <p>{section.name}</p>
                <div className='text font-extralight text-gray-400'>
                  {`$` +
                    sectionPrices?.find(
                      (sectionPrice) => sectionPrice.section_id === section.id,
                    )?.price}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
