'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { UserProfile } from 'supabase';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { trpc } from '~/app/_trpc/client';

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
      </div>
    </div>
  );
}
