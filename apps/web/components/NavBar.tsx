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

import Link from 'next/link';
import { cn } from './ui/utils';
import * as React from 'react';
import { Button } from './ui/button';
import { User } from '@supabase/supabase-js';
import { UserNav } from './UserNav';
import { CommandMenu } from './ui/command-menu';
import { UserProfile } from 'supabase';
import MessageCenter from './MessageCenter';
import Image from 'next/image';

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
  user: User | undefined;
  userProfile: UserProfile | null;
  userOrg: string | null | undefined;
}) {
  const mainComponents: {
    title: string;
    href: string;
    image?: string;
  }[] = [
    {
      title: 'Home',
      href: '/',
      image: '/no-bg.png',
    },
    {
      title: 'Explore Events',
      href: '/event/list',
    },
    {
      title: 'My Tickets',
      href: `/${userProfile?.username}/tickets`,
    },
  ];

  return (
    <div className='flex flex-col'>
      <div className='fixed top-0 z-40 hidden h-16 w-full items-center bg-black/50 px-8 backdrop-blur-md transition-colors duration-500 md:flex'>
        <NavigationMenu>
          <NavigationMenuList>
            {mainComponents.map((component) => (
              <div key={component.title}>
                {component.title === 'My Tickets' && !user ? (
                  <div key={component.title}></div>
                ) : (
                  <NavigationMenuItem key={component.title}>
                    <Link href={component.href} legacyBehavior passHref>
                      {component.image ? (
                        <NavigationMenuLink>
                          <Image
                            className='pr-4 pt-2'
                            src={component.image}
                            alt='image'
                            width={75}
                            height={75}
                          />
                        </NavigationMenuLink>
                      ) : (
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {component.title}
                        </NavigationMenuLink>
                      )}
                    </Link>
                  </NavigationMenuItem>
                )}
              </div>
            ))}
            {userOrg && (
              <NavigationMenuItem>
                <Link href={`/dashboard/${userOrg}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Admin Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {/* {user ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                  {createComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <div></div>
          )} */}
          </NavigationMenuList>
        </NavigationMenu>
        <div className='flex flex-1 items-center justify-between space-x-6 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            <CommandMenu />
          </div>
          {user ? (
            <div className='ml-auto mt-1.5 flex space-x-4'>
              <MessageCenter />
              <UserNav user={user} userProfile={userProfile} />
            </div>
          ) : (
            <div className='ml-auto flex items-center space-x-4 '>
              <Link href='/sign-in'>
                <Button variant='secondary'>Sign In</Button>
              </Link>
              <Link href='/sign-up'>
                <Button className='bg-white/70'>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* <div className='fixed z-40 mt-16 hidden w-full flex-row items-center justify-center py-1.5 text-center text-lg  md:flex'> */}
      {/* <div className='relative'> */}
      {/* <div className='flex flex-row items-center rounded-full border bg-black/40 backdrop-blur-md'> */}
      {/* <div className='rounded-full border-r bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 py-2 backdrop-blur-xl'> */}
      {/* <span
                className='animate-text-gradient 
              bg-gradient-to-r from-red-500 via-yellow-400
             to-red-500 bg-[200%_auto] bg-clip-text px-4 py-2 font-semibold text-transparent'
              >
                
                New Message
              </span> */}
      {/* <span className='px-4 py-2 font-semibold'>New Message</span> */}
      {/* </div> */}
      {/* <p className='px-4 font-light text-muted-foreground'> */}
      {/* This is a test message that someone will recieve */}
      {/* </p> */}
      {/* </div> */}
      {/* <span className='absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-blue-700'></span> */}
      {/* </div> */}
      {/* </div> */}
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
