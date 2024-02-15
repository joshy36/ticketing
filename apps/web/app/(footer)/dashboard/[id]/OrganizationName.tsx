'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { Organization } from 'supabase';

export default function OrganizationName({
  organization,
}: {
  organization: Organization | null | undefined;
}) {
  const [name, setName] = useState<string>(organization?.name!);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateName = trpc.updateOrganizationName.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error(error);
        toast.error('Error updating organization name', {
          description: 'Please try again',
        });
      } else if (data) {
        toast.success('Organization name updated');
      }
    },
  });

  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Organization Name</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex w-full max-w-sm items-center space-x-2 pt-4'>
          <Input
            type='email'
            defaultValue={organization?.name!}
            className='text-muted-foreground'
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            disabled={isLoading}
            className='w-32 rounded-md'
            onClick={() => {
              updateName.mutate({
                organization_id: organization?.id!,
                name: name,
              });
            }}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
