'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/components/ui/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { CheckIcon, Mail } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SendMessage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();
  const { data: venues, isLoading: venuesLoading } = trpc.getVenues.useQuery();
  const { data: artists, isLoading: artistsLoading } =
    trpc.getArtists.useQuery();

  const sendMessage = trpc.sendMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        toast.error('Error sending message');
        console.error('Error sending message:', error);
      } else {
        toast.success('Message sent');
      }
      setIsLoading(false);
    },
  });

  const formSchema = z.object({
    type: z.enum(['artist', 'venue'], {
      required_error: 'Please select a type.',
    }),
    artist: z.string().optional(),
    venue: z.string().optional(),
    message: z.string().min(2, {
      message: 'Message must be at least 2 characters.',
    }),
    event: z.string({
      required_error: 'Please select an event to link to.',
    }),
    yourFans: z.string({
      required_error: 'Please select a group of fans to send to.',
    }),
    generalFans: z.string({
      required_error: 'Please select a group of fans to send to.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'artist',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('test');
    setIsLoading(true);
    sendMessage.mutate({
      fromType: values.type,
      // do this better
      from: values.type === 'artist' ? values.artist! : values.venue!,
      message: values.message,
      event_id: values.event,
      yourFans: values.yourFans,
      generalFans: values.generalFans,
    });
  }

  return (
    <div>
      <Card className='mt-4 rounded-md border bg-zinc-950'>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
          <CardDescription>
            Send out a message to your user base to notify them of upcoming
            events and special promotions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex w-full max-w-sm items-center space-x-2 pb-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                <div className='flex flex-row gap-24'>
                  <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoading}
                            className='flex flex-col gap-2'
                          >
                            <FormItem className='flex items-center space-x-2 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='artist' />
                              </FormControl>
                              <FormLabel className='font-normal'>
                                Artist
                              </FormLabel>
                            </FormItem>
                            <FormItem className='flex items-center space-x-2 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='venue' />
                              </FormControl>
                              <FormLabel className='font-normal'>
                                Venue
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  {form.watch('type') === 'artist' ? (
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
                                    'w-[200px] justify-between rounded-md',
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
                                          key={artist.id}
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
                  ) : (
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
                                    'w-[200px] justify-between rounded-md',
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
                                          key={venue.id}
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
                  )}
                </div>
                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Message...' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the message the will be sent out to your users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='event'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Select an Event</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'w-[200px] justify-between rounded-md',
                                !field.value && 'text-muted-foreground ',
                              )}
                            >
                              {events ? (
                                <div>
                                  {field.value
                                    ? events.find(
                                        (event) => event.id === field.value,
                                      )?.name
                                    : 'Select event'}
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
                              placeholder='Search events...'
                              className='h-9'
                            />
                            <CommandEmpty>No events found.</CommandEmpty>
                            <CommandGroup>
                              {events ? (
                                <div>
                                  {events.map((event) => (
                                    <CommandItem
                                      value={event.name}
                                      key={event.id}
                                      onSelect={() => {
                                        form.setValue('event', event.id);
                                      }}
                                    >
                                      {event.name}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          event.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </div>
                              ) : (
                                <div>No events!</div>
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Link to an event. When a user clicks on the message they
                        will be redirected to this event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='yourFans'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Fans</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a group' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='0'>
                            Don&apos;t send to any of your fans.
                          </SelectItem>
                          <SelectItem value='.25'>
                            Send to the top 25% of your fans.
                          </SelectItem>
                          <SelectItem value='.50'>
                            Send to the top 50% of your fans.
                          </SelectItem>
                          <SelectItem value='.75'>
                            Send to the top 75% of your fans.
                          </SelectItem>
                          <SelectItem value='1'>
                            Send to all of your fans.
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Send to a specific group of your fans (fans that have
                        been to an event you have hosted).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='generalFans'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General Fans</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a group' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='0'>
                            Don&apos;t send to any general fans.
                          </SelectItem>
                          <SelectItem value='.25'>
                            Send to the top 25% of all fans.
                          </SelectItem>
                          <SelectItem value='.50'>
                            Send to the top 50% of all fans.
                          </SelectItem>
                          <SelectItem value='.75'>
                            Send to the top 75% of all fans.
                          </SelectItem>
                          <SelectItem value='1'>
                            Send to all fans on the platform.
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Send to a specific group of all fans on the platform.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='gap-2 rounded-md'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Mail className='mr-2 h-4 w-4' />
                  )}
                  Send
                </Button>
              </form>
            </Form>
          </div>
          {/* <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px] text-muted-foreground'>
                  User
                </TableHead>
                <TableHead className='text-muted-foreground'>
                  Your Events
                </TableHead>
                <TableHead className='text-muted-foreground'>
                  Total Events
                </TableHead>
                <TableHead className=' text-muted-foreground'>Send?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: any, index: number) => (
                <TableRow
                  key={user.id}
                  className={index % 2 === 0 ? 'gap-4 bg-black' : 'bg-zinc-950'}
                >
                  <TableCell className='font-medium'>
                    {`User ` + index}
                  </TableCell>
                  <TableCell>{1}</TableCell>
                  <TableCell>{2}</TableCell>
                  <TableCell className=''>
                    <Checkbox className='rounded' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
        </CardContent>
      </Card>
    </div>
  );
}
