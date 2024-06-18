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

import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { trpc } from '../app/_trpc/client';

import AnimatedGradientText from './AnimatedGradientText';
import { toast } from 'sonner';

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
  userOrg: string | null | undefined;
}) {
  const router = useRouter();

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

  return (
    <div className='flex flex-col'>
      <div className='fixed top-0 z-40 hidden h-16 w-full items-center border-b bg-black/50 px-8 backdrop-blur-md transition-colors duration-500 md:flex'>
        <div className='flex flex-1 items-center justify-between space-x-6 md:justify-end'></div>
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
