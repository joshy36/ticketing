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

import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { trpc } from '../../_trpc/client';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Artist name must be at least 2 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
});

export default function ArtistCreate() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const createArtist = trpc.createArtist.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          description: 'Error creating artist',
        });
        console.error('Error creating artist:', error);
        setIsLoading(false);
      } else {
        router.refresh();
        router.push(`/artist/create/image/${data.id}`);
      }
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    createArtist.mutate({
      name: values.name,
      description: values.description,
    });
  }

  return (
    <div className='space-y-6 p-10 pb-16 sm:block'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Create Artist</h2>
        <p className='text-muted-foreground'>
          Please fill in all the details to create a profile for an artist!
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
                    <FormLabel>Artist Name</FormLabel>
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
