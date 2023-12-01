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
} from '../../../components/ui/card';
import { dateToString } from '@/utils/helpers';
import { Separator } from '../../../components/ui/separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../components/ui/avatar';

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

  const { data: event } = trpc.getEventById.useQuery({ id: ticket?.event_id! });
  const { data: artist } = trpc.getArtistById.useQuery(
    { id: event?.artist! },
    { enabled: !!event },
  );
  const { data: venue } = trpc.getVenueById.useQuery(
    { id: event?.venue! },
    { enabled: !!event },
  );
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
    <div className='flex flex-col items-center justify-center px-8 py-16'>
      <div className='flex flex-row items-center pb-4'>
        <Button variant='secondary' onClick={() => setFront(!front)}>
          Flip
        </Button>
      </div>

      {front ? (
        <Card className='w-[350px] border bg-zinc-950'>
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
        <Card className='w-[350px] border bg-zinc-950'>
          <CardHeader>
            <CardTitle>{ticket?.events?.name}</CardTitle>
            <CardDescription> {`Seat: ${ticket!.seat}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='bg-zinc-950 p-2 '>
              <div>
                <p className='pb-4 text-2xl'>Artist</p>

                <div className='flex flex-row items-center justify-start'>
                  <Avatar className='h-14 w-14'>
                    {artist?.image ? (
                      <AvatarImage src={artist?.image} alt='pfp' />
                    ) : (
                      <AvatarFallback></AvatarFallback>
                    )}
                  </Avatar>
                  <p className='pl-4 text-muted-foreground'>{artist?.name}</p>
                </div>
              </div>
              <Separator className='my-6' />
              <p className='pb-4 text-2xl'>Venue</p>

              <p className='text-muted-foreground'>{venue?.name}</p>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <p className='text-muted-foreground'>
              {dateToString(ticket?.events?.date!)}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
