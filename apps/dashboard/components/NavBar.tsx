'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Link from 'next/link';
import { cn } from './ui/utils';
import * as React from 'react';
import { Button } from './ui/button';
import { User } from '@supabase/supabase-js';
import { UserNav } from './UserNav';
import { CommandMenu } from './ui/command-menu';
import { UserProfile } from 'supabase';
import Image from 'next/image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { SlashIcon } from '@radix-ui/react-icons';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronRight } from 'lucide-react';
import { trpc } from '../app/_trpc/client';

import AnimatedGradientText from './AnimatedGradientText';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export const createComponents: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: 'Create Event',
    href: '/event/create',
    description: 'A page to create an event.',
  },
  {
    title: 'Create Artist',
    href: '/artist/create',
    description: 'A page to create an artist.',
  },
  {
    title: 'Create Venue',
    href: '/venue/create',
    description: 'A page to create a venue.',
  },
];

export default function NavBar({
  user,
  userProfile,
  userOrg,
}: {
  user: User | null;
  userProfile: UserProfile | null;
  userOrg: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<string | null>(null);

  const { data: events } = trpc.getEventsByOrganization.useQuery({
    organization_id: userOrg?.id!,
  });

  useEffect(() => {
    if (pathname.includes('event')) {
      const eventId = pathname.split('/').pop();
      const event = events?.find((event) => event.id === eventId);
      setBreadcrumbs(event?.name || null);
    }
  }, [events, pathname]);

  const signOut = trpc.signOut.useMutation({
    onSettled(error) {
      if (error) {
        toast.error('Error signing out', {
          description: 'Please try again',
        });
      } else {
        router.push('/');
        router.refresh();
      }
    },
  });

  const handleSignOut = async () => {
    signOut.mutate();
  };

  console.log(pathname);
  return (
    <div className='flex flex-col'>
      <div className='fixed top-0 z-40 hidden h-16 w-full items-center border-b bg-black/50 px-8 backdrop-blur-md transition-colors duration-500 md:flex md:justify-between'>
        {userOrg && (
          <Breadcrumb>
            <BreadcrumbList>
              <DropdownMenu>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/'> {userOrg.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <DropdownMenuTrigger className='flex items-center gap-1'>
                  <ChevronDownIcon className='h-4 w-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  <DropdownMenuItem>{userOrg.name}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {pathname.includes('event') && (
                <>
                  <BreadcrumbSeparator>
                    <SlashIcon />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <div className='flex flex-row items-center gap-2'>
                        {events?.find(
                          (event) => event.id === pathname.split('/').pop(),
                        )?.image && (
                          <Image
                            src={
                              events?.find(
                                (event) =>
                                  event.id === pathname.split('/').pop(),
                              )?.image!
                            }
                            alt='event image'
                            width={28}
                            height={28}
                            className='aspect-square rounded-sm'
                          />
                        )}
                        <p>{breadcrumbs}</p>
                      </div>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {userProfile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-10 w-10 rounded-full'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={userProfile?.profile_image!} alt='img' />
                  {/* <AvatarFallback>SC</AvatarFallback> */}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {userProfile?.first_name + ' ' + userProfile?.last_name}
                  </p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    {userProfile?.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
