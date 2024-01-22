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
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function SendMessage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

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
    message: z.string().min(2, {
      message: 'Message must be at least 2 characters.',
    }),
    event: z.string({
      required_error: 'Please select an event to link to.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    sendMessage.mutate({
      to: users!.map((user) => user.id),
      message: values.message,
      event_id: values.event,
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
                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='Message...' {...field} />
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
                                      key={event.name}
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
          <Table>
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
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
