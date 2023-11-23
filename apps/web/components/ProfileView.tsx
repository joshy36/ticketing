import createServerClient from '@/utils/supabaseServer';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { serverClient } from '../../../apps/web/app/_trpc/serverClient';

export default async function ProfileView({
  params,
}: {
  params: { username: string };
}) {
  const userProfile = await serverClient.getUserProfile.query({
    username: params.username,
  });

  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      <div className='grid grid-cols-1 gap-8 px-4 pt-16 md:grid-cols-2 md:px-16'>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src={userProfile?.profile_image!}
            alt='user pfp'
            width={300}
            height={300}
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

        <div>
          <div className='flex'>
            {userProfile?.first_name && (
              <p className='py-4 text-8xl'>{userProfile.first_name}</p>
            )}
            {userProfile?.last_name && (
              <p className='ml-8 py-4 text-8xl'>{userProfile.last_name}</p>
            )}
          </div>
          <p className='py-4 text-2xl font-light text-muted-foreground'>{`@${userProfile?.username}`}</p>
          {userProfile?.bio && (
            <p className='py-4 text-2xl'>{`${userProfile?.bio}`}</p>
          )}

          {/* <p className='text-xl text-muted-foreground'>{artist.description}</p> */}
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className='bg-background'>
  //     <div className='pt-6'>
  //       <div className='flex justify-start pl-20'>
  //         <Image
  //           src={userProfile?.profile_image!}
  //           alt='user pfp'
  //           width={500}
  //           height={500}
  //           className='rounded-lg'
  //         />
  //       </div>

  //       <div className='mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16'>
  //         <div className='lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8'>
  //           <h1 className='text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl'>
  //             {`@${userProfile?.username}`}
  //           </h1>
  //         </div>

  //         <div className='mt-4 lg:row-span-3 lg:mt-0'>
  // {session?.user! && session?.user.id === userProfile?.id ? (
  //   <form className='mt-10'>
  //     <Link href={`/${userProfile.username}/edit/`}>
  //       <Button variant='default' className='flex w-full'>
  //         Edit Profile
  //       </Button>
  //     </Link>
  //   </form>
  // ) : (
  //   <div></div>
  // )}
  //         </div>

  //         <div className='py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6'>
  //           <div>
  // <div className='inline-block space-y-6'>
  //   {userProfile?.first_name ? (
  //     <p className='inline text-base text-accent-foreground'>{`${userProfile.first_name} `}</p>
  //   ) : (
  //     <p></p>
  //   )}
  //   {userProfile?.last_name ? (
  //     <p className='inline text-base text-accent-foreground'>{`${userProfile.last_name}`}</p>
  //   ) : (
  //     <p></p>
  //   )}
  // </div>
  // <div className='space-y-6'>
  //   <p className='text-base text-accent-foreground'>
  //     {userProfile?.bio}
  //   </p>
  // </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
