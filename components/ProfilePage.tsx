import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/components/ProfileForm';
import { SidebarNav } from '@/components/SidebarNav';
import { serverClient } from '@/app/_trpc/serverClient';
import UserUploadImage from './UserUploadImage';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/examples/forms',
  },
  {
    title: 'Account',
    href: '/examples/forms/account',
  },

  {
    title: 'Notifications',
    href: '/examples/forms/notifications',
  },
];

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const userProfile = await serverClient.getUserProfile({ id: params.id });

  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div> */}
      <div className=" space-y-6 p-10 pb-16 sm:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Profile</h3>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>
            <Separator />
            <ProfileForm userProfile={userProfile!} />
            <Separator />
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <Separator />
            <UserUploadImage
              id={params.id}
              userImage={userProfile?.profile_image}
              buttonText="Update profile picture"
            />
          </div>
        </div>
      </div>
    </>
  );
}
