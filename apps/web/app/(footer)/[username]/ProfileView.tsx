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
import { notFound } from 'next/navigation';
import { Wallet } from 'lucide-react';
import FriendsView from './FriendsView';
import AvatarView from './AvatarView';

export default async function ProfileView({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createSupabaseServer();

  const userProfile = await serverClient.getUserProfile.query({
    username: params.username,
  });

  const friendCount = await serverClient.getTotalFriendsCountForUser.query({
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

  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-24'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row justify-between'>
          <AvatarView userProfile={userProfile} />
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
          <FriendsView userProfile={userProfile} friendCount={friendCount} />
          {userProfile?.bio && (
            <p className='font-light'>{`${userProfile?.bio}`}</p>
          )}
          {user.user && user.user?.id !== userProfile?.id && (
            <FriendRequest
              currentUserId={user.user?.id!}
              otherUserProfile={userProfile}
            />
          )}
        </div>
      </div>
      <Separator className='my-8' />
      {/* <div className='flex flex-row items-center justify-center gap-2'>
        <h2 className='text-center text-2xl font-bold lg:text-3xl'>
          Social Wallet
        </h2>
        <Wallet />
      </div> */}

      <div className='flex flex-col'>
        <div>
          <div className='flex flex-row items-center gap-2'>
            <div className='text-center text-2xl font-semibold'>
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
                    This is your digital ticket stub from the event. Show it off
                    on social media and send it to friends to mark your great
                    experience.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Ok</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className='gap-8 pt-8'>
            {collectibles?.length === 0 ? (
              <div className='pb-4 font-extralight text-muted-foreground'>
                Attend events to build a collection.
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
                {collectibles?.map((collectible) => (
                  <div key={collectible.id}>
                    <div className='relative'>
                      {collectible.events?.image ? (
                        <Image
                          src={collectible.image || collectible.events?.image}
                          alt='collectible Image'
                          width={500}
                          height={500}
                          className='aspect-square h-full w-full rounded-lg border object-cover object-center'
                        />
                      ) : (
                        <Image
                          src='/fallback.jpeg'
                          alt='image'
                          width={500}
                          height={500}
                          className='aspect-square h-full w-full rounded-lg border object-cover object-center'
                        />
                      )}

                      <div className='absolute bottom-0 left-0 right-0 rounded-bl-lg rounded-br-lg bg-zinc-900 bg-opacity-50 backdrop-blur-md'>
                        <h1 className='py-4 pl-4 text-sm text-accent-foreground'>
                          {collectible.events?.name}
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className='flex flex-row items-center gap-2 pt-8'>
            <div className='text-center text-2xl font-semibold'>Community</div>
            <AlertDialog>
              <AlertDialogTrigger>
                <InfoCircledIcon />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Community</AlertDialogTitle>
                  <AlertDialogDescription>
                    The event ends, but the memory remains with you. This is
                    your owned events based social graph.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Ok</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className='gap-8 pt-8'>
            {sbts?.length === 0 ? (
              <div className='pb-4 font-extralight text-muted-foreground'>
                Attend events to build a collection.
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
                {sbts?.map((sbt) => (
                  <div key={sbt.id}>
                    <div className='relative'>
                      {sbt.events?.image ? (
                        <Image
                          src={sbt.events?.image}
                          alt='sbt Image'
                          width={500}
                          height={500}
                          className='aspect-square h-full w-full rounded-lg border object-cover object-center'
                        />
                      ) : (
                        <Image
                          src='/fallback.jpeg'
                          alt='image'
                          width={500}
                          height={500}
                          className='aspect-square h-full w-full  rounded-lg border object-cover object-center'
                        />
                      )}

                      <div className='absolute bottom-0 left-0 right-0 rounded-bl-lg rounded-br-lg bg-zinc-900 bg-opacity-50 backdrop-blur-md'>
                        <h1 className='py-4 pl-4 text-sm text-accent-foreground'>
                          {sbt.events?.name}
                        </h1>
                      </div>
                    </div>
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
