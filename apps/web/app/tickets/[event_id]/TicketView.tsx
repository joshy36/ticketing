'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
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
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export function TicketView({
  tickets,
  userProfile,
  event_id,
}: {
  tickets: any;
  userProfile: UserProfile;
  event_id: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qr, setQR] = useState<string>('');
  const [front, setFront] = useState<boolean>(true);
  const [ticketNumber, setTicketNumber] = useState<number>(0);

  const { data: event } = trpc.getEventById.useQuery({ id: event_id });
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
        if (error.message === 'Ticket already activated!') {
          toast.error('Ticket already activated, try refreshing the page!');
        } else {
          toast.error('Error activating ticket');
        }
        console.error('Error activating ticket:', error);
        setIsLoading(false);
      } else {
        // router.refresh();
        toast.success('Ticket activated!');

        setIsLoading(false);
        setQR(data!);
        tickets[ticketNumber].qr_code = data;
      }
    },
  });

  useEffect(() => {
    setQR(tickets[ticketNumber].qr_code);
  }, []);

  return (
    <div className='flex flex-row items-center justify-center pt-16'>
      <div
        key={tickets[ticketNumber]?.id}
        className='flex snap-center flex-col items-center justify-center'
      >
        <div className='flex flex-row items-center justify-between gap-16 pb-4'>
          {ticketNumber !== 0 ? (
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                setTicketNumber(ticketNumber - 1);
                setQR(tickets[ticketNumber - 1].qr_code);
              }}
              className='rounded-md'
            >
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
          ) : (
            <Button
              variant='outline'
              size='icon'
              className='invisible rounded-md'
            >
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
          )}
          <Button
            variant='secondary'
            className='rounded-md'
            onClick={() => setFront(!front)}
          >
            Flip
          </Button>
          {ticketNumber < tickets.length - 1 ? (
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                setTicketNumber(ticketNumber + 1);
                setQR(tickets[ticketNumber + 1].qr_code);
              }}
              className='rounded-md'
            >
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
          ) : (
            <Button
              variant='outline'
              size='icon'
              className='invisible rounded-md'
            >
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
          )}
        </div>
        <div className='pb-2 font-light text-muted-foreground'>
          Ticket {ticketNumber + 1} of {tickets.length}
        </div>
        {front ? (
          <Card className='w-[350px] border bg-zinc-950'>
            <CardHeader>
              <CardTitle>{tickets[ticketNumber]?.events?.name}</CardTitle>
              <CardDescription>
                {' '}
                {`Seat: ${tickets[ticketNumber]!.seat}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='bg-background '>
                {tickets[ticketNumber]!.events?.image ? (
                  <Image
                    src={tickets[ticketNumber]!.events?.image}
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
                <div className='pt-4'>
                  <Button
                    disabled={isLoading}
                    className='w-full'
                    onClick={() => {
                      setIsLoading(true);

                      activateTicket.mutate({
                        user_id: userProfile.id,
                        ticket_id: tickets[ticketNumber]!.id,
                      });
                    }}
                  >
                    Activate
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className='flex'>
              <p className='text-sm font-light text-muted-foreground'>
                {dateToString(tickets[ticketNumber]?.events?.date!)}
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className='w-[350px] border bg-zinc-950'>
            <CardHeader>
              <CardTitle>{tickets[ticketNumber]?.events?.name}</CardTitle>
              <CardDescription>
                {' '}
                {`Seat: ${tickets[ticketNumber]!.seat}`}
              </CardDescription>
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
            <CardFooter className='flex'>
              <p className='text-sm font-light text-muted-foreground'>
                {dateToString(tickets[ticketNumber]?.events?.date!)}
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
