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

import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { trpc } from '../../../../_trpc/client';

import { useState } from 'react';
import { cn } from '@/components/ui/utils';

const formSchema = z.object({
  max: z.coerce.number({ required_error: 'Please enter a value.' }),
  sections: z
    .array(
      z.object({
        value: z.coerce.number({
          required_error: 'Please enter a valid number.',
        }),
      }),
    )
    .optional(),
});

export default function EventCreateTickets({ eventId }: { eventId: string }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const createTickets = trpc.createTicketsForEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        toast({
          description: 'Error updating event',
        });
        console.error('Error updating event:', error);
        setIsLoading(false);
      } else {
        router.push(`/event/create/image/${eventId}`);
      }
    },
  });

  const { data: event, isLoading: eventLoading } = trpc.getEventById.useQuery({
    id: eventId,
  });

  const { data: sections, isLoading: sectionsLoading } =
    trpc.getSectionsForVenue.useQuery(
      { id: event?.venue! },
      { enabled: !!event },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    createTickets.mutate({
      max_tickets: values.max,
      venue_id: event?.venue!,
      event_id: eventId,
      sections_ids: sections?.map((s) => ({ value: s.id }))!,
      section_prices: values.sections!,
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
      <div className='space-y-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='max'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Maximum number of tickets a user can purchase for this
                      event.
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='' disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {sections &&
                sections.map((section, index) => (
                  <div key={section.id}>
                    <FormField
                      control={form.control}
                      key={section.id}
                      name={`sections.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && 'sr-only')}>
                            Sections
                          </FormLabel>
                          <FormDescription
                            className={cn(index !== 0 && 'sr-only')}
                          >
                            Add a ticket price for each section. Enter 0 for
                            free tickets.
                          </FormDescription>
                          <p>{section.name}</p>
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
                  </div>
                ))}
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
