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

export default function Home() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(), // Set to the current date
    // to: addDays(new Date(), 5), // Set to the current date + 5 days
  });

  return (
    <main>
      <div className='flex flex-row items-center justify-center'>
        <p className='z-30 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text pr-2 pt-20 text-center text-4xl font-bold tracking-tighter text-transparent md:pr-4 md:text-6xl lg:pr-8 lg:text-8xl'>
          Discover
        </p>
        <p className='z-30 bg-white bg-clip-text pt-20 text-center text-4xl font-bold tracking-tighter text-transparent md:text-6xl lg:text-8xl'>
          new events.
        </p>
      </div>

      <div className='z-0 -mt-36 flex items-center justify-center'>
        <div className='b z-0 h-96 w-full'></div>
        <div className='b2 z-0 h-96 w-full'></div>
      </div>

      <div className='z-30 mx-auto -mt-36 flex max-w-md flex-row items-center justify-center gap-4 rounded-full border  bg-black/20 px-4 py-4 backdrop-blur-3xl sm:px-6 sm:py-4 lg:max-w-3xl lg:px-6'>
        <div className={cn('grid gap-2')}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='date'
                variant={'outline'}
                className={cn(
                  'hidden h-12 w-[250px] justify-start border-none bg-black/30 text-left font-normal backdrop-blur-3xl hover:bg-black/60 lg:flex',
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

        {/* <Command className='rounded-lg border shadow-md'>
          <CommandInput placeholder='Search events, artists, venues...' />
          <CommandList>
            <CommandEmpty></CommandEmpty>
            <CommandGroup heading='Suggestions'>
              <CommandItem>
                <CalendarIcon className='mr-2 h-4 w-4' />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <FaceIcon className='mr-2 h-4 w-4' />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <RocketIcon className='mr-2 h-4 w-4' />
                <span>Launch</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Settings'>
              <CommandItem>
                <PersonIcon className='mr-2 h-4 w-4' />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <EnvelopeClosedIcon className='mr-2 h-4 w-4' />
                <span>Mail</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <GearIcon className='mr-2 h-4 w-4' />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command> */}

        <Input
          className='z-30 h-12 w-80 rounded-full border-none bg-black/30 backdrop-blur-3xl md:w-96'
          placeholder='Search events, artists, venues'
        />

        <Button className='z-30 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 text-white'>
          Search
        </Button>
      </div>
    </main>
  );
}
