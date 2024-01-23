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

export default function Home() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(), // Set to the current date
    // to: addDays(new Date(), 5), // Set to the current date + 5 days
  });

  const { data: events } = trpc.getEvents.useQuery();

  return (
    <main>
      <div className='flex flex-row items-center justify-center'>
        <p className='z-30 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text py-20 text-center text-4xl font-bold tracking-tighter text-transparent md:pr-4 md:text-6xl lg:pr-8 lg:text-8xl'>
          Discover new events.
        </p>
      </div>

      <div className='z-30 mx-auto flex max-w-md flex-row items-center justify-center gap-2 sm:px-6 sm:py-4 lg:max-w-3xl lg:px-6'>
        <div className={cn('grid gap-2')}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='date'
                variant={'outline'}
                className={cn(
                  'hidden h-12 w-[250px] justify-start rounded-md border-none bg-black/70 text-left font-normal backdrop-blur-3xl hover:bg-black/90 lg:flex',
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
          className='z-30 h-12 w-80 rounded-md border-none bg-black/70 backdrop-blur-3xl hover:bg-black/90 md:w-96'
          placeholder='Search events, artists, venues'
        />

        <Button className='z-30 h-12 rounded-md bg-indigo-300/80 hover:bg-indigo-400/80'>
          Search
        </Button>
      </div>
      <div className='flex flex-row items-center justify-center pt-48'>
        <div className='w-full md:w-2/3'>
          <Marquee
            fade={true}
            pauseOnHover={true}
            className='gap-[3rem] [--duration:100s]'
            innerClassName='gap-[3rem] [--gap:3rem]'
          >
            {events?.map((event: any) => (
              <a key={event.id} href={`/event/${event.id}`} className='group'>
                <div className='overflow-hidden rounded-lg'>
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.description}
                      width={500}
                      height={500}
                      className='h-48 w-48 object-cover object-center transition duration-300 ease-in-out hover:scale-105'
                    />
                  ) : (
                    <Image
                      src='/fallback.jpeg'
                      alt='image'
                      width={500}
                      height={500}
                      className='h-48 w-48 object-cover object-center'
                    />
                  )}
                </div>
                <h1 className='mt-2 text-xl text-accent-foreground'>
                  {event.name}
                </h1>
                <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
                  {`${dateToString(event.date)}`}
                </p>
                <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
                  {`${event.venues.name}`}
                </p>
              </a>
            ))}
          </Marquee>
        </div>
      </div>

      {/* <div className='flex flex-row items-center justify-center'>
        <p className='z-30 bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text pt-20 text-center text-4xl font-bold tracking-tighter text-transparent md:pr-4 md:text-6xl lg:pr-8 lg:text-8xl'>
          Build a community.
        </p>
      </div> */}
    </main>
  );
}
