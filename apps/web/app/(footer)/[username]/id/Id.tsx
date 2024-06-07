'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { UserProfile } from 'supabase';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { trpc } from '~/app/_trpc/client';
import Menu from './Menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';

export function Id({ userProfile }: { userProfile: UserProfile }) {
  const [qrCode, showQRCode] = useState(false);

  const { data: userSalt, isLoading: saltLoading } = trpc.getUserSalt.useQuery({
    user_id: userProfile?.id!,
  });

  return (
    <div className='flex flex-col items-center justify-center pt-8'>
      <div className='flex w-72 flex-col items-center justify-center rounded-3xl border p-6'>
        <Avatar className='h-48 w-48'>
          {userProfile?.profile_image ? (
            <AvatarImage src={userProfile?.profile_image} alt='pfp' />
          ) : (
            <AvatarFallback></AvatarFallback>
          )}
        </Avatar>
        <Separator className='my-4' />
        {userSalt && qrCode && (
          <div className='flex flex-col items-center justify-center'>
            <Button onClick={() => showQRCode(!qrCode)} className='mb-4 w-full'>
              Hide QR
            </Button>
            <QRCode
              value={userSalt.salt!}
              bgColor='#000000'
              fgColor='#FFFFFF'
            />
          </div>
        )}
        {!qrCode && (
          <Button
            onClick={() => showQRCode(!qrCode)}
            variant='secondary'
            className='w-full'
          >
            Show QR
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger className='w-full pt-4'>
            <Button variant='outline' className='w-full'>
              Order Food
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              {/* <AlertDialogTitle>Menu</AlertDialogTitle> */}
              <AlertDialogDescription>
                <Menu />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Place Order</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
