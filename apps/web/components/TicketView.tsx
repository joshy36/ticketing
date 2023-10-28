'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { TicketOutput } from 'api';
import { UserProfile } from 'supabase';
import QRCode from 'react-qr-code';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { dateToString } from '@/utils/helpers';

export function TicketView({
  ticket,
  userProfile,
}: {
  ticket: TicketOutput;
  userProfile: UserProfile;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qr, setQR] = useState<string>('');
  const [front, setFront] = useState<boolean>(true);
  const activateTicket = trpc.generateTicketQRCode.useMutation({
    onSettled(data, error) {
      if (error) {
        toast({
          description: 'Error activating ticket',
        });
        console.error('Error activating ticket:', error);
        setIsLoading(false);
      } else {
        // router.refresh();
        toast({
          description: 'Ticket activated!!',
        });
        setIsLoading(false);
        setQR(data!);
      }
    },
  });

  useEffect(() => {
    if (ticket?.qr_code) {
      setQR(ticket.qr_code);
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-row items-center pb-4'>
        <Button variant='secondary' onClick={() => setFront(!front)}>
          Flip
        </Button>
        <div className='px-2 font-bold'>
          {front ? <h1>Front</h1> : <h1>Back</h1>}
        </div>
      </div>

      {front ? (
        <Card className='w-[400px] '>
          <CardHeader>
            <CardTitle>{ticket?.events?.name}</CardTitle>
            <CardDescription> {`Seat: ${ticket!.seat}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='bg-background '>
              {ticket!.events?.image ? (
                <Image
                  src={ticket!.events?.image}
                  alt='Ticket Image'
                  width={500}
                  height={500}
                  className=''
                />
              ) : (
                <Image
                  src='/fallback.jpeg'
                  alt='image'
                  width={500}
                  height={500}
                  className='h-full w-full object-cover object-center group-hover:opacity-75'
                />
              )}
            </div>

            {qr ? (
              <div className='flex items-center justify-center bg-white p-4'>
                <QRCode value={qr} />
              </div>
            ) : (
              <div className='flex items-center justify-center pt-4'>
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    setIsLoading(true);

                    activateTicket.mutate({
                      user_id: userProfile.id,
                      ticket_id: ticket!.id,
                    });
                  }}
                >
                  Activate
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className='flex justify-between'>
            <p className='text-muted-foreground'>
              {dateToString(ticket?.events?.date!)}
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Card className='w-[400px]'>
          <CardHeader>
            <CardTitle>{ticket?.events?.name}</CardTitle>
            <CardDescription> {`Seat: ${ticket!.seat}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='bg-background p-2 '>
              <h1>Artist Info</h1>
              <h1>Venue Info</h1>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
