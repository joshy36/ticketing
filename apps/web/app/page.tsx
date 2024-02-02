'use client';

import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from '@radix-ui/react-icons';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '../components/ui/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Marquee } from '@/components/ui/marquee';
import { dateToString } from '@/utils/helpers';
import { trpc } from './_trpc/client';
import { useEffect, useState } from 'react';
import StarComponent from '@/components/StarComponent';

export default function Home() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(), // Set to the current date
    // to: addDays(new Date(), 5), // Set to the current date + 5 days
  });

  const { data: events } = trpc.getEvents.useQuery();

  return (
    <main>
      <StarComponent />
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <div className='flex flex-col justify-center'>
          <div className='rounded-3xl border border-zinc-800 bg-black/10 py-4 backdrop-blur-sm'>
            <div className='flex flex-row items-center justify-center'>
              <p className='z-30 bg-gradient-to-r from-red-800 via-yellow-800 to-yellow-700 bg-clip-text py-20 text-center text-4xl font-bold tracking-tighter text-transparent md:pr-4 md:text-6xl lg:pr-8 lg:text-8xl'>
                Discover new events.
              </p>
            </div>

            <div className='z-30 mx-auto flex max-w-md flex-col items-center justify-center gap-2 sm:px-6 sm:py-4 lg:max-w-3xl lg:flex-row lg:px-6'>
              <div className={cn('grid gap-2')}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='date'
                      variant={'outline'}
                      className={cn(
                        'hidden h-12 w-[250px] justify-start rounded-full border-muted-foreground bg-black/70 text-left font-normal backdrop-blur-3xl hover:bg-black/90 lg:flex',
                        !date && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, 'LLL dd, y')} -{' '}
                            {format(date.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(date.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      initialFocus
                      mode='range'
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Input
                className='z-30 h-12 w-80 rounded-full border-muted-foreground bg-black/70 backdrop-blur-3xl hover:bg-black/90 md:w-96'
                placeholder='Search events, artists, venues'
              />

              <Button className='z-30 h-12 rounded-full bg-stone-300'>
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
