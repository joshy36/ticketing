'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';

export default function SendMessage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();

  const sendMessage = trpc.sendMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        toast({
          description: 'Error sending message',
          variant: 'default',
        });
        console.error('Error sending message:', error);
      } else {
        toast({
          description: 'Message sent!',
        });
      }
      setIsLoading(false);
    },
  });

  return (
    <div>
      <div className='pt-4 text-lg text-white'>
        Send out a message to your user base to notify them of upcoming events
        and special promotions.
      </div>
      <div className='flex w-full max-w-sm items-center space-x-2 pt-4'>
        <Input
          type='email'
          placeholder='Message...'
          className='text-muted-foreground'
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          disabled={isLoading}
          className='rounded-md'
          onClick={() => {
            sendMessage.mutate({
              to: users!.map((user) => user.id),
              message: message,
            });
          }}
        >
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          Send
        </Button>
      </div>
    </div>
  );
}
