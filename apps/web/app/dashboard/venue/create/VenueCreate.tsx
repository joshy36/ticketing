'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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

import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { trpc } from '../../../_trpc/client';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Venue name must be at least 2 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  sections: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  rows: z.array(
    z.object({
      value: z.coerce
        .number()
        .min(0, {
          message: 'Must be at least one row',
        })
        .max(1000, {
          message: 'Cant be more than 1000 rows',
        }),
    }),
  ),
  seats_per_row: z.array(
    z.object({
      value: z.coerce
        .number()
        .min(0, {
          message: 'Must be at least one row',
        })
        .max(1000, {
          message: 'Cant be more than 1000 rows',
        }),
    }),
  ),
});
type FormValues = z.infer<typeof formSchema>;

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  sections: [{ value: 'GA' }],
};

export default function VenueCreate() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const createVenue = trpc.createVenue.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          description: 'Error creating venue',
        });
        console.error('Error creating venue:', error);
        setIsLoading(false);
      } else {
        router.refresh();
        router.push(`/venue/create/image/${data.id}`);
      }
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);

    createVenue.mutate({
      name: values.name,
      description: values.description,
      sections: values.sections,
      rows: values.rows,
      seats_per_row: values.seats_per_row,
    });
  }

  const { fields, append, remove } = useFieldArray({
    name: 'sections',
    control: form.control,
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='space-y-0.5'>
        <h1 className='pb-2 text-4xl font-light'>Create Venue</h1>
        <p className='text-muted-foreground'>
          Please fill in all the details to create a profile for the venue!
        </p>
      </div>
      <Separator className='my-6' />
      <div className='space-y-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input placeholder='' disabled={isLoading} {...field} />
                    </FormControl>
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
                        placeholder=''
                        className='resize-none'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <h1>Seating</h1>
                <p className='text-muted-foreground'>
                  Add sections to the venue
                </p>
                {fields.map((field, index) => (
                  <div className='py-4' key={field.id}>
                    <FormField
                      control={form.control}
                      name={`sections.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          {/* <FormDescription
                            className={cn(index !== 0 && 'sr-only')}
                          >
                            Add sections to the venue.
                          </FormDescription> */}
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`rows.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Rows</FormLabel>
                          <FormDescription>
                            Enter 0 if there are no rows in the section.
                          </FormDescription>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`seats_per_row.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Seats per Row</FormLabel>
                          <FormDescription>
                            If there are no rows, enter the number of tickets in
                            the section.
                          </FormDescription>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='mt-2'
                  onClick={() => append({ value: '' })}
                >
                  Add Section
                </Button>
                {fields.length > 1 ? (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='mt-2'
                    onClick={() => remove(fields.length - 1)}
                  >
                    Remove Section
                  </Button>
                ) : (
                  <div></div>
                )}
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
