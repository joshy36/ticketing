import createServerClient from '@/lib/supabaseServer';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { serverClient } from '@/app/_trpc/serverClient';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default async function ProfileView({
  params,
}: {
  params: { id: string };
}) {
  const userProfile = await serverClient.getUserProfile({ id: params.id });

  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-background">
      <div className="pt-6">
        <div className="flex justify-center">
          <Avatar className="h-40 w-40">
            {userProfile?.profile_image ? (
              <AvatarImage src={userProfile?.profile_image!} alt="pfp" />
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl">
              {`@${userProfile?.username}`}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            {/* <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-accent-foreground">{`$99999`}</p> */}
            {user! && user.id === params.id ? (
              <form className="mt-10">
                <Link href={`/user/edit/${params.id}`}>
                  <Button variant="default" className="flex w-full">
                    Edit Profile
                  </Button>
                </Link>
              </form>
            ) : (
              <div></div>
            )}
            {/* <form className="mt-10">
              <Link href={`/user/edit/${params.id}`}>
                <Button variant="default" className="flex w-full">
                  Edit Profile
                </Button>
              </Link>
            </form> */}
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 inline-block">
                {userProfile?.first_name ? (
                  <p className="text-base text-accent-foreground inline">{`${userProfile.first_name} `}</p>
                ) : (
                  <p></p>
                )}
                {userProfile?.last_name ? (
                  <p className="text-base text-accent-foreground inline">{`${userProfile.last_name}`}</p>
                ) : (
                  <p></p>
                )}
              </div>
              <div className="space-y-6">
                <p className="text-base text-accent-foreground">
                  {userProfile?.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
