import createServerClient from '@/utils/supabaseServer';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { serverClient } from '../../../apps/web/app/_trpc/serverClient';
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
} from '@/components/ui/alert-dialog';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Separator } from './ui/separator';

export default async function ProfileView({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createServerClient();

  const userProfile = await serverClient.getUserProfile.query({
    username: params.username,
  });

  const sbts = await serverClient.getSbtsForUser.query({
    user_id: userProfile?.id!,
  });

  const collectibles = await serverClient.getCollectiblesForUser.query({
    user_id: userProfile?.id!,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
      <div className='flex flex-col gap-8 md:flex-row'>
        <div className='flex flex-col items-center justify-center '>
          <Image
            src={userProfile?.profile_image!}
            alt='user pfp'
            width={250}
            height={250}
            className='rounded-lg'
          />
          {session?.user! && session?.user.id === userProfile?.id ? (
            <Link className='pt-4' href={`/${userProfile.username}/edit/`}>
              <Button variant='default' className='flex w-full'>
                Edit Profile
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
        <div className='flex flex-col items-start justify-start'>
          <div className='flex'>
            {userProfile?.first_name && (
              <p className='py-4 text-5xl font-medium'>
                {userProfile.first_name}
              </p>
            )}
            {userProfile?.last_name && (
              <p className='ml-4 py-4 text-5xl font-medium'>
                {userProfile.last_name}
              </p>
            )}
          </div>
          <p className='pb-8 font-light text-muted-foreground'>{`@${userProfile?.username}`}</p>
          {userProfile?.bio && (
            <p className='py-4 text-xl font-light'>{`${userProfile?.bio}`}</p>
          )}
        </div>
      </div>
      <Separator className='my-8' />
      <div className='grid grid-cols-1 gap-8 px-4 pt-8 md:grid-cols-2 md:px-16'>
        <div>
          <div className='flex flex-row items-center justify-center gap-2'>
            <div className='text-center text-2xl underline underline-offset-8'>
              Collectibles
            </div>
            <AlertDialog>
              <AlertDialogTrigger>
                <InfoCircledIcon />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Collectibles</AlertDialogTitle>
                  <AlertDialogDescription>
                    Lets explain what these are
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Ok</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className='grid grid-cols-1 gap-8 px-4 pt-8 md:pt-32'>
            {collectibles?.length === 0 ? (
              <div className='text-center text-2xl font-extralight'>
                Attend events to build a collection!
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-8 px-4 pt-8 md:pt-32'>
                You have some collectibles that i need to show
              </div>
            )}
          </div>
        </div>
        <div>
          <div className='flex flex-row items-center justify-center gap-2'>
            <div className='text-center text-2xl underline underline-offset-8'>
              SBTs
            </div>
            <AlertDialog>
              <AlertDialogTrigger>
                <InfoCircledIcon />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>SBTs</AlertDialogTitle>
                  <AlertDialogDescription>
                    Lets explain what these are
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Ok</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className='grid grid-cols-1 gap-8 px-4 pt-8 md:pt-32'>
            {sbts?.length === 0 ? (
              <div className='text-center text-2xl font-extralight'>
                Attend events to build a collection!
              </div>
            ) : (
              <div className='grid grid-cols-1 '>
                {/* {sbts?.map((ticket) => ( */}
                <div>
                  <div>You have some SBTs that i need to show</div>
                  <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background'>
                    {/* {ticket.events?.image ? (
                        <Image
                          src={ticket.events?.image}
                          alt='Ticket Image'
                          width={500}
                          height={500}
                          className='h-full w-full object-cover object-center duration-300 ease-in-out hover:scale-105 group-hover:opacity-75'
                        />
                      ) : (
                        <Image
                          src='/fallback.jpeg'
                          alt='image'
                          width={500}
                          height={500}
                          className='h-full w-full object-cover object-center group-hover:opacity-75'
                        />
                      )} */}
                  </div>
                  {/* <h1 className='mt-4 text-lg text-accent-foreground'>
                      {ticket.events?.name}
                    </h1>
                    <p className='font-sm mt-1 text-sm text-muted-foreground'>
                      {`Seat: ${ticket.seat}`}
                    </p> */}
                </div>
                {/* ))} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
