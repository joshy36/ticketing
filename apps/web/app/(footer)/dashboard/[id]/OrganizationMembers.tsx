'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { Organization } from 'supabase';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';

export default function OrganizationMembers({
  organization,
}: {
  organization: Organization | null | undefined;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const { data: members, refetch } = trpc.getOrganizationMembers.useQuery(
    {
      organization_id: organization?.id!,
    },
    { enabled: !!organization },
  );

  const addUser = trpc.addUserToOrganization.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error(error);
        if (error.message === 'User is already in an organization') {
          toast.error('User already in organization', {
            description: 'Please try a different username',
          });
        } else {
          console.error('Error adding user to org, user not found');
          toast.error('User not found', {
            description: 'Please try a different username',
          });
        }
      } else if (data) {
        refetch();
        toast.success('User added to organization');
      }
      setIsLoading(false);
    },
  });

  const removeUserFromOrg = trpc.removeUserFromOrganization.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error(error);
        toast.error('Error removing user', {
          description: 'Please try again!',
        });
      } else {
        refetch();
        toast.success('User removed', {
          description: 'User is no longer in the organization.',
        });
      }
    },
  });

  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Organization Members</CardTitle>
        <CardDescription>
          Add or remove members from your org. Members have full authority to do
          anything within the organization including creating artists, venues
          and events. All members are automatically added as scanners for each
          event you create. You can add or remove scanners on the specific
          event&apos;s management page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {members?.map((member) => (
            <div
              key={member.id}
              className='flex flex-row items-center justify-between gap-4 border-b py-3'
            >
              <ProfileCard userProfile={member.user_profiles!} />
              {member.role === 'owner' ? (
                <Badge variant='secondary'>Owner</Badge>
              ) : (
                <Button
                  variant='outline'
                  className='rounded-md border-red-900 text-red-900 hover:bg-red-900'
                  onClick={() => {
                    removeUserFromOrg.mutate({
                      username: member.user_profiles?.username!,
                      organization_id: organization?.id!,
                    });
                  }}
                >
                  <X className='mr-2 h-4 w-4' />
                  Remove
                </Button>
              )}
            </div>
          ))}
          <div className='flex w-full max-w-sm items-center space-x-2 pt-4'>
            <Input
              type='text'
              placeholder='username'
              className='text-muted-foreground'
              onChange={(e) => setUser(e.target.value)}
            />
            <Button
              disabled={isLoading}
              className='w-32 rounded-md'
              onClick={() => {
                setIsLoading(true);
                addUser.mutate({
                  username: user,
                  organization_id: organization?.id!,
                });
              }}
            >
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
