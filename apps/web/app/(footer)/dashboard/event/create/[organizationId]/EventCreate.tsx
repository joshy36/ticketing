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

import { Calendar } from '@/components/ui/calendar';

import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/components/ui/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { trpc } from '../../../../../_trpc/client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../../../../../../components/ui/command';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { dateToString } from '@/utils/helpers';

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

export default function EventCreate({
  organizationId,
}: {
  organizationId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { data: artists, isLoading: artistsLoading } =
    trpc.getArtists.useQuery();

  const { data: venues, isLoading: venuesLoading } = trpc.getVenues.useQuery();

  const createEvent = trpc.createEvent.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast.error('Error creating event');
        console.error('Error creating event:', error);
        setIsLoading(false);
      } else {
        router.refresh();
        router.push(`/dashboard/event/tickets/${organizationId}/${data.id}`);
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const time = values.time.split(':');

    if (values.ampm === 'pm') {
      time[0] = ((Number(time[0]) + 12) % 24).toString();
    }

    // console.log('date: ', values.date);

    values.date.setHours(Number(time[0]));
    values.date.setMinutes(Number(time[1]));
    // console.log('date: ', values.date);

    createEvent.mutate({
      name: values.name,
      artist: values.artist,
      venue: values.venue,
      description: values.description,
      date: values.date,
      image: null,
      organization_id: organizationId,
    });
  }

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='space-y-0.5'>
        <h1 className='pb-2 text-4xl font-light'>Create Event</h1>
        <p className='text-muted-foreground'>
          Please fill in all the details to create your event!
        </p>
      </div>
      <Separator className='my-6' />
      <div className='flex justify-center'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-6'>
              <div className='flex flex-col items-center justify-center'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Event Name</FormLabel> */}
                      <FormControl>
                        <Input
                          className='h-18 border-none text-center text-4xl font-medium placeholder:text-center lg:text-6xl'
                          placeholder='Event Name...'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex flex-row items-center gap-8 pt-4'>
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
                          <PopoverContent className='w-auto p-0' align='start'>
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
                      <FormItem className='flex flex-col'>
                        <FormLabel>Event Time (EST)</FormLabel>
                        <FormControl>
                          <Input
                            className='rounded-full'
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
                            className='flex flex-col gap-2'
                          >
                            <FormItem className='flex items-center space-x-2 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='pm' />
                              </FormControl>
                              <FormLabel className='font-normal'>PM</FormLabel>
                            </FormItem>
                            <FormItem className='flex items-center space-x-2 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='am' />
                              </FormControl>
                              <FormLabel className='font-normal'>AM</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 justify-center gap-8 pt-6 md:max-w-[1000px] md:grid-cols-2'>
                <div>
                  <Card className='sticky top-24 border p-2 shadow-2xl shadow-zinc-800'>
                    <CardHeader className='text-2xl font-bold lg:text-3xl'>
                      Tickets
                    </CardHeader>
                    <CardContent>
                      Choose pricing for the sections on the next page.
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-2xl font-semibold'>
                          Description
                        </FormLabel>
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
                  <Separator className='my-6' />
                  <FormField
                    control={form.control}
                    name='artist'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel className='text-2xl font-semibold'>
                          Artist
                        </FormLabel>
                        {form.watch('artist') && (
                          <div className='flex items-center py-4'>
                            <Avatar className='h-14 w-14'>
                              {artists?.find(
                                (artist) => artist.id === form.watch('artist'),
                              ) ? (
                                <AvatarImage
                                  src={
                                    artists?.find(
                                      (artist) =>
                                        artist.id === form.watch('artist'),
                                    )?.image!
                                  }
                                  alt='pfp'
                                />
                              ) : (
                                <AvatarFallback></AvatarFallback>
                              )}
                            </Avatar>
                            <p className='pl-4 font-light text-muted-foreground'>
                              {
                                artists?.find(
                                  (artist) =>
                                    artist.id === form.watch('artist'),
                                )?.name
                              }
                            </p>
                          </div>
                        )}
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
                                          (artist) => artist.id === field.value,
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
                          If you can&apos;t find the artist in this list, create
                          a profile{' '}
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
                  <Separator className='my-6' />
                  <FormField
                    control={form.control}
                    name='venue'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel className='text-2xl font-semibold'>
                          Venue
                        </FormLabel>
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
                          If you can&apos;t find the venue in this list, create
                          a profile{' '}
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
                </div>
              </div>
            </div>

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
