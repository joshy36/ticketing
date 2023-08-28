'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';

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
    .max(30, {
      message: 'First name must not be longer than 30 characters.',
    })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Must not contain spaces or special characters',
    })
    .optional(),
  lastname: z
    .string()
    .max(30, {
      message: 'Last name must not be longer than 30 characters.',
    })
    .regex(/^[a-zA-Z]+$/, {
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

export function ProfileForm({ params }: { params: { user: UserProfile } }) {
  const user: UserForm = {
    bio: nullToUndefined(params.user.bio),
    first_name: nullToUndefined(params.user.first_name),
    id: params.user.id,
    last_name: nullToUndefined(params.user.last_name),
    profile_image: nullToUndefined(params.user.profile_image),
    username: nullToUndefined(params.user.username),
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
    const userUpdate = JSON.stringify({
      username: undefinedToNull(data.username) === '' ? null : data.username,
      first_name:
        undefinedToNull(data.firstname) === '' ? null : data.firstname,
      last_name: undefinedToNull(data.lastname) === '' ? null : data.lastname,
      bio: undefinedToNull(data.bio) === '' ? null : data.bio,
    });

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    try {
      toast({
        description: 'Updating profile...',
      });
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(baseUrl + `/api/user/edit/${user.id}`, {
        method: 'PATCH',
        body: userUpdate,
        cache: 'no-store',
      });

      if (!res.ok) {
        toast({
          description: 'Error updating profile',
        });
        throw new Error('Failed to update profile');
      } else {
        toast({
          description: 'Profile updated successfully!',
        });
      }
    } catch (error) {
      toast({
        description: 'Error updating profile',
      });
      console.error('Error updating profile:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
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
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
