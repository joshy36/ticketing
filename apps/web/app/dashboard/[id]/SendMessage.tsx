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

export default function SendMessage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();

  const sendMessage = trpc.sendMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        toast.error('Error sending message');
        console.error('Error sending message:', error);
      } else {
        toast.success('Message sent');
      }
      setIsLoading(false);
    },
  });

  return (
    <div>
      <Card className='mt-4 rounded-md border bg-zinc-950'>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
          <CardDescription>
            Send out a message to your user base to notify them of upcoming
            events and special promotions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex w-full max-w-sm items-center space-x-2'>
            <Input
              type='email'
              placeholder='Message...'
              className='text-muted-foreground'
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              disabled={isLoading}
              className='w-32 rounded-md'
              onClick={() => {
                sendMessage.mutate({
                  to: users!.map((user) => user.id),
                  message: message,
                });
              }}
            >
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
