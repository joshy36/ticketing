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
import { Button, buttonVariants } from './ui/button';
import { User } from '@supabase/supabase-js';
import { UserNav } from './UserNav';
import { CommandMenu } from './ui/command-menu';
import { UserProfile } from 'supabase';

export const mainComponents: {
  title: string;
  href: string;
}[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Explore Events',
    href: '/event/list',
  },
  {
    title: 'My Tickets',
    href: '/ticket',
  },
];

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
}: {
  user: User | undefined;
  userProfile: UserProfile | null;
}) {
  return (
    <div className='fixed top-0 z-40 hidden h-16 w-full items-center bg-black/40 px-8 backdrop-blur-md transition-colors duration-500 md:flex'>
      <NavigationMenu>
        <NavigationMenuList>
          {mainComponents.map((component) => (
            <div key={component.title}>
              {component.title === 'My Tickets' && !user ? (
                <div key={component.title}></div>
              ) : (
                <NavigationMenuItem key={component.title}>
                  <Link href={component.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {component.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </div>
          ))}
          {user ? (
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
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <div className='flex flex-1 items-center justify-between space-x-6 md:justify-end'>
        <div className='w-full flex-1 md:w-auto md:flex-none'>
          <CommandMenu />
        </div>
        {user ? (
          <div className='mt-1'>
            <UserNav user={user} userProfile={userProfile} />
          </div>
        ) : (
          <div className=''>
            <Link href='/sign-in'>
              <Button variant='secondary'>Sign In</Button>
            </Link>
            <Link href='/sign-up'>
              <Button>Sign Up</Button>
            </Link>
          </div>
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
