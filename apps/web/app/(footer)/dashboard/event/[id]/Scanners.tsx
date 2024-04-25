'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { trpc } from '~/app/_trpc/client';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { toast } from 'sonner';
import { Icons } from '~/components/ui/icons';
import { useState } from 'react';
import { Events } from 'supabase';
import { X } from 'lucide-react';
import ProfileCard from '~/components/ProfileCard';

export default function Scanners({ event }: { event: Events }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const { data: scanners, refetch } = trpc.getScannersForEvent.useQuery(
    {
      event_id: event?.id!,
    },
    { enabled: !!event },
  );

  const addScanner = trpc.addScannerToEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error(error);
        if (error.message === 'User is already a scanner') {
          toast.error('User already a scanner', {
            description: 'Please try a different username',
          });
        } else {
          console.error('Error adding user as scanner, user not found');
          toast.error('User not found', {
            description: 'Please try a different username',
          });
        }
      } else if (data) {
        refetch();
        toast.success('User added as scanner', {
          description: 'User can now scan tickets for this event',
        });
      }
      setIsLoading(false);
    },
  });

  const removeScanner = trpc.removeScannerFromEvent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error(error);
        toast.error('Error removing scanner', {
          description: 'Please try again',
        });
      } else {
        refetch();
        toast.success('Scanner removed', {
          description: 'User can no longer scan tickets for this event',
        });
      }
    },
  });

  return (
    <Card className='mt-4 rounded-md border bg-zinc-950'>
      <CardHeader>
        <CardTitle>Event Scanners</CardTitle>
        <CardDescription>
          Add or remove scanners for the event. A user does not need to be in
          your organization to add them as a scanner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {scanners?.map((scanner) => (
            <div
              key={scanner.id}
              className='flex flex-row items-center justify-between gap-4 border-b py-3'
            >
              <ProfileCard userProfile={scanner.user_profiles!} />
              <Button
                variant='outline'
                className='rounded-md border-red-900 text-red-900 hover:bg-red-900'
                onClick={() => {
                  removeScanner.mutate({
                    username: scanner.user_profiles?.username!,
                    event_id: event.id!,
                  });
                }}
              >
                <X className='mr-2 h-4 w-4' />
                Remove
              </Button>
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
                addScanner.mutate({
                  username: user,
                  event_id: event.id!,
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
