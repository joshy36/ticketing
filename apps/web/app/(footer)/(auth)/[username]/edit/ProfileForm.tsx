'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/ui/icons';
import { trpc } from '../../../../_trpc/client';
import { UserProfile } from 'supabase';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .regex(/^[a-zA-Z0-9_\-]+$/, {
      message: 'Your username can contain letters, numbers, _ and -',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  firstname: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .max(30, {
      message: 'First name must not be longer than 30 characters.',
    })
    .regex(/^[a-zA-Z]*$/, {
      message: 'Must not contain spaces or special characters',
    })
    .optional(),
  lastname: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Last name must not be longer than 30 characters.',
    })
    .regex(/^[a-zA-Z]*$/, {
      message: 'Must not contain spaces or special characters',
    })
    .optional(),
  bio: z.string().max(160).optional(),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: 'Please enter a valid URL.' }),
  //     })
  //   )
  //   .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type UserForm = {
  bio: string | undefined;
  first_name: string | undefined;
  id: string;
  last_name: string | undefined;
  profile_image: string | undefined;
  username: string | undefined;
};

function nullToUndefined(value: string | null): string | undefined {
  return value ?? undefined;
}

function undefinedToNull(value: string | undefined): string | null {
  return value ?? null;
}

export function ProfileForm({ userProfile }: { userProfile: UserProfile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const updateUser = trpc.updateUser.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast.error('Error updating profile');
        console.error('Error updating profile:', error);
      } else {
        router.refresh();
        toast.success('Profile updated successfully');
      }
      setIsLoading(false);
    },
  });

  const user: UserForm = {
    bio: nullToUndefined(userProfile.bio),
    first_name: nullToUndefined(userProfile.first_name),
    id: userProfile.id,
    last_name: nullToUndefined(userProfile.last_name),
    profile_image: nullToUndefined(userProfile.profile_image),
    username: nullToUndefined(userProfile.username),
  };

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    username: user.username,
    firstname: user.first_name,
    lastname: user.last_name,
    bio: user.bio,
    // urls: [
    //   { value: 'https://shadcn.com' },
    //   { value: 'http://twitter.com/shadcn' },
    // ],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // const { fields, append } = useFieldArray({
  //   name: 'urls',
  //   control: form.control,
  // });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    updateUser.mutate({
      id: user.id,
      username: data.username === '' ? null : undefinedToNull(data.username),
      first_name:
        data.firstname === '' ? null : undefinedToNull(data.firstname),
      last_name: data.lastname === '' ? null : undefinedToNull(data.lastname),
      bio: data.bio === '' ? null : undefinedToNull(data.bio),
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='' disabled={isLoading} {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-row gap-6'>
            <FormField
              control={form.control}
              name='firstname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Tell us a little bit about yourself'
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
            {/* {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button> */}
          </div>
          <Button
            className='w-48'
            variant='secondary'
            type='submit'
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
