import createSupabaseServer from '~/utils/supabaseServer';
import Image from 'next/image';
import { serverClient } from '../../_trpc/serverClient';
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
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Separator } from '~/components/ui/separator';
import UserSignOut from './UserSignOut';
import CopyWallet from './CopyWallet';
import FriendRequest from './FriendRequest';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { notFound } from 'next/navigation';
import { Wallet } from 'lucide-react';

export default async function ProfileView({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createSupabaseServer();

  const userProfile = await serverClient.getUserProfile.query({
    username: params.username,
  });

  const friendCount = await serverClient.getTotalFriendsForUser.query({
    username: params.username,
  });

  if (!userProfile) {
    notFound();
  }

  const sbts = await serverClient.getSbtsForUser.query({
    user_id: userProfile?.id!,
  });

  const collectibles = await serverClient.getCollectiblesForUser.query({
    user_id: userProfile?.id!,
  });

  // console.log(collectibles);
  // console.log(sbts);

  const { data: user } = await supabase.auth.getUser();

  console.log('user:', user);

  const relationship = await serverClient.getFriendshipStatus.query({
    currentUserId: user?.user?.id,
    otherUser: params.username,
  });

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-24'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row justify-between'>
          <Avatar className='h-32 w-32'>
            {userProfile?.profile_image ? (
              <AvatarImage src={userProfile?.profile_image} alt='pfp' />
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
          {user && user.user?.id === userProfile?.id && (
            <UserSignOut userProfile={userProfile} />
          )}
        </div>

        <div className='flex flex-col items-start justify-start'>
          <div className='flex items-center'>
            {userProfile?.first_name && (
              <p className='py-2 text-2xl font-medium md:text-3xl'>
                {userProfile.first_name}
              </p>
            )}
            {userProfile?.last_name && (
              <p className='mx-2 py-2 text-2xl font-medium md:ml-2 md:text-3xl'>
                {userProfile.last_name}
              </p>
            )}
            {userProfile?.wallet_address && (
              <CopyWallet userProfile={userProfile} />
            )}
          </div>
          <div className='flex flex-row'>
            <p className='md:text-md pb-6 text-sm font-light text-muted-foreground'>{`@${userProfile?.username} ·`}</p>
            <p className='md:text-md ml-1 pb-6 text-sm font-semibold text-muted-foreground hover:underline'>{`${friendCount} friends`}</p>
          </div>
          {userProfile?.bio && (
            <p className='font-light'>{`${userProfile?.bio}`}</p>
          )}
          {user.user && user.user?.id !== userProfile?.id && (
            <FriendRequest
              userProfile={userProfile}
              relationship={relationship}
            />
          )}
        </div>
      </div>
      <Separator className='my-8' />
      <div className='flex flex-row items-center justify-center gap-2'>
        <h2 className='text-center text-2xl font-bold lg:text-3xl'>
          Social Wallet
        </h2>
        <Wallet />
      </div>

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
          <div className='grid grid-cols-1 gap-8 px-4 pt-8'>
            {collectibles?.length === 0 ? (
              <div className='text-center text-xl font-extralight md:pt-32'>
                Attend events to build a collection!
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                {collectibles?.map((sbt) => (
                  <div key={sbt.id}>
                    <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background'>
                      {sbt.events?.image ? (
                        <Image
                          src={sbt.events?.image}
                          alt='sbt Image'
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
                      )}
                    </div>
                    <h1 className='mt-4 text-lg text-accent-foreground'>
                      {sbt.events?.name}
                    </h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className='flex flex-row items-center justify-center gap-2'>
            <div className='text-center text-2xl underline underline-offset-8'>
              Community
            </div>
            <AlertDialog>
              <AlertDialogTrigger>
                <InfoCircledIcon />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Community</AlertDialogTitle>
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
          <div className='grid grid-cols-1 gap-8 px-4 pt-8'>
            {sbts?.length === 0 ? (
              <div className='text-center text-xl font-extralight md:pt-32'>
                Attend events to build a collection!
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                {sbts?.map((sbt) => (
                  <div key={sbt.id}>
                    <div className='xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background'>
                      {sbt.events?.image ? (
                        <Image
                          src={sbt.events?.image}
                          alt='sbt Image'
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
                      )}
                    </div>
                    <h1 className='mt-4 text-lg text-accent-foreground'>
                      {sbt.events?.name}
                    </h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
