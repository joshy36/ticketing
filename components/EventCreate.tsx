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

import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from './ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Icons } from './ui/icons';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Event name must be at least 2 characters.',
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
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
});

export default function EventCreate() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const time = values.time.split(':');
    values.date.setHours(Number(time[0]));
    values.date.setMinutes(Number(time[1]));

    const event = JSON.stringify({
      name: values.name,
      description: values.description,
      date: values.date,
      location: values.location,
      image: null,
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(baseUrl + `/api/event/create`, {
        method: 'POST',
        body: event,
        cache: 'no-store',
      });

      if (!res.ok) {
        toast({
          description: 'Error creating event',
        });
        throw new Error('Failed to create event');
      }
      const eventBody = await res.json();
      const id = eventBody[0].id;
      router.refresh();
      router.push(`/event/create/image/${id}`);
    } catch (error) {
      toast({
        description: 'Error creating event',
      });
      console.error('Error creating event:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-10 pb-16 sm:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Create Event</h2>
        <p className="text-muted-foreground">
          Please fill in all the details to create your event!
        </p>
      </div>
      <Separator className="my-6" />
      <div className="space-y-6">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Come join us for an unforgettable night!!"
                        className="resize-none"
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Time (EST)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="8:30"
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
                name="ampm"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="pm" />
                          </FormControl>
                          <FormLabel className="font-normal">PM</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="am" />
                          </FormControl>
                          <FormLabel className="font-normal">AM</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Next Page
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
