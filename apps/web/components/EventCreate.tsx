'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Calendar } from './ui/calendar';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from './ui/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from './ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from './ui/icons';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';
import { trpc } from '../../../apps/web/app/_trpc/client';
import { Switch } from './ui/switch';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Event name must be at least 2 characters.',
  }),
  artist: z.string({
    required_error: 'Please select an artist.',
  }),
  venue: z.string({
    required_error: 'Please select a venue.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  ga_tickets: z.coerce
    .number()
    .min(1, {
      message: 'Must be at least one ticket',
    })
    .max(1000, {
      message: 'Cant be more than 1000 tickets',
    }),
  // regex later
  ga_price: z.coerce
    .number()
    .min(0, { message: 'Ticket price can not be negative' }),
  seats: z.boolean().default(false).optional(),
  rows: z.coerce
    .number()
    .min(0, {
      message: 'Cant be less than 0 rows.',
    })
    .max(100, {
      message: 'Cant be more than 100 rows.',
    }),
  seats_per_row: z.coerce
    .number()
    .min(0, {
      message: 'Cant be less than 0 seats per row.',
    })
    .max(20, {
      message: 'Cant be more than 20 seats per row.',
    }),

  date: z.date({
    required_error: 'A date is required.',
  }),
  time: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]$/, {
    message: 'Must input a valid time.',
  }),
  ampm: z.enum(['pm', 'am'], {
    required_error: 'You need to select PM or AM.',
  }),
});

export default function EventCreate() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const { data: artists, isLoading: artistsLoading } =
    trpc.getArtists.useQuery();

  const { data: venues, isLoading: venuesLoading } = trpc.getVenues.useQuery();

  const createEvent = trpc.createEvent.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          description: 'Error creating event',
        });
        console.error('Error creating event:', error);
        setIsLoading(false);
      } else {
        router.refresh();
        router.push(`/event/create/image/${data.id}`);
      }
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      rows: 0,
      seats_per_row: 0,
    },
  });
  const noSeats = !form.watch('seats');

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const time = values.time.split(':');

    if (values.ampm == 'pm') {
      time[0] += 12;
    }

    values.date.setHours(Number(time[0]));
    values.date.setMinutes(Number(time[1]));

    createEvent.mutate({
      name: values.name,
      artist: values.artist,
      venue: values.venue,
      description: values.description,
      ga_tickets: values.ga_tickets,
      ga_price: values.ga_price,
      rows: values.rows,
      seats_per_row: values.seats_per_row,
      date: values.date,
      image: null,
    });
  }

  return (
    <div className='space-y-6 p-10 pb-16 sm:block'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Create Event</h2>
        <p className='text-muted-foreground'>
          Please fill in all the details to create your event!
        </p>
      </div>
      <Separator className='my-6' />
      <div className='space-y-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>General Information</AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=''
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='artist'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Artist</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-[200px] justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {artists ? (
                                    <div>
                                      {field.value
                                        ? artists.find(
                                            (artist) =>
                                              artist.id === field.value,
                                          )?.name
                                        : 'Select artist'}
                                    </div>
                                  ) : (
                                    <div></div>
                                  )}
                                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput
                                  placeholder='Search artists...'
                                  className='h-9'
                                />
                                <CommandEmpty>No artists found.</CommandEmpty>
                                <CommandGroup>
                                  {artists ? (
                                    <div>
                                      {artists.map((artist) => (
                                        <CommandItem
                                          value={artist.name}
                                          key={artist.name}
                                          onSelect={() => {
                                            form.setValue('artist', artist.id);
                                          }}
                                        >
                                          {artist.name}
                                          <CheckIcon
                                            className={cn(
                                              'ml-auto h-4 w-4',
                                              artist.id === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </div>
                                  ) : (
                                    <div>No artists!</div>
                                  )}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            If you can&apos;t find the artist in this list,
                            create a profile{' '}
                            <Link
                              href='/artist/create'
                              className='underline underline-offset-4 hover:text-primary'
                            >
                              here.
                            </Link>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='venue'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Venue</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-[200px] justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {venues ? (
                                    <div>
                                      {field.value
                                        ? venues.find(
                                            (venue) => venue.id === field.value,
                                          )?.name
                                        : 'Select venue'}
                                    </div>
                                  ) : (
                                    <div></div>
                                  )}
                                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput
                                  placeholder='Search venues...'
                                  className='h-9'
                                />
                                <CommandEmpty>No venues found.</CommandEmpty>
                                <CommandGroup>
                                  {venues ? (
                                    <div>
                                      {venues.map((venue) => (
                                        <CommandItem
                                          value={venue.name}
                                          key={venue.name}
                                          onSelect={() => {
                                            form.setValue('venue', venue.id);
                                          }}
                                        >
                                          {venue.name}
                                          <CheckIcon
                                            className={cn(
                                              'ml-auto h-4 w-4',
                                              venue.id === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </div>
                                  ) : (
                                    <div>No venues!</div>
                                  )}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            If you can&apos;t find the venue in this list,
                            create a profile{' '}
                            <Link
                              href='/venue/create'
                              className='underline underline-offset-4 hover:text-primary'
                            >
                              here.
                            </Link>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Come join us for an unforgettable night!!'
                              className='resize-none'
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Event date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-[240px] pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                  disabled={isLoading}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Select a date</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='time'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Time (EST)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='8:30'
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='ampm'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isLoading}
                              className='flex flex-col space-y-1'
                            >
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='pm' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  PM
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='am' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  AM
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>Ticketing Information</AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='ga_tickets'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of GA Tickets</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=''
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='ga_price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GA Ticket Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=''
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter 0 for free tickets.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='seats'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                          <div className='space-y-0.5'>
                            <FormLabel className='text-base'>Seating</FormLabel>
                            <FormDescription>
                              Are there seats in your venue?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {noSeats ? (
                      <div></div>
                    ) : (
                      <div className='space-y-6'>
                        <FormField
                          control={form.control}
                          name='rows'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Rows</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder=''
                                  disabled={isLoading || noSeats}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='seats_per_row'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Seats Per Row</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder=''
                                  disabled={isLoading || noSeats}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button type='submit' disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Next Page
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
