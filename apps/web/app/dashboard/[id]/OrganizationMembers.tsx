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
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { Organization } from 'supabase';

export default function OrganizationMembers({
  organization,
}: {
  organization: Organization | null | undefined;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const { toast } = useToast();
  const { data: members } = trpc.getOrganizationMembers.useQuery(
    {
      organization_id: organization?.id!,
    },
    { enabled: !!organization },
  );

  const addUser = trpc.addUserToOrganization.useMutation({
    onSettled(data, error) {
      if (!data) {
        console.error('Error adding user to org, user not found');
        toast({
          title: 'User not found.',
          description: 'Please try a differnt username.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    },
  });

  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Organization Members</CardTitle>
        <CardDescription>
          Add or remove members from your org. Members have full authority to do
          anything within the organization including creating artists, venues
          and events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {members?.map((member) => (
            <div
              key={member.id}
              className='flex flex-row items-center gap-4 border-b border-t py-3'
            >
              <div>
                <Avatar>
                  {member?.profile_image ? (
                    <AvatarImage src={member?.profile_image!} alt='pfp' />
                  ) : (
                    <AvatarFallback></AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <div className='flex'>
                  {member?.first_name && (
                    <p className='py-1 font-medium'>{member.first_name}</p>
                  )}
                  {member?.last_name && (
                    <p className='ml-1 py-1 font-medium'>{member.last_name}</p>
                  )}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {`@${member.username}`}
                </div>
              </div>
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
