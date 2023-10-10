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
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Button, buttonVariants } from './ui/button';
import { User } from '@supabase/supabase-js';
import { UserNav } from './UserNav';
import { CommandMenu } from './ui/command-menu';

export const mainComponents: {
  title: string;
  href: string;
}[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Upcoming Events',
    href: '/event/list',
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
  user: User | null;
  userProfile: UserProfile | null;
}) {
  return (
    <div className='hidden h-16 items-center px-8 md:flex'>
      <NavigationMenu>
        <NavigationMenuList>
          {mainComponents.map((component) => (
            <NavigationMenuItem key={component.title}>
              <Link href={component.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {component.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
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
          <div className='ml-auto flex items-center space-x-4'>
            <UserNav user={user} userProfile={userProfile} />
          </div>
        ) : (
          <div className='ml-auto flex items-center space-x-4'>
            <Link href='/sign-in'>
              {' '}
              <Button className={cn(buttonVariants({ variant: 'default' }))}>
                Sign In
              </Button>
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
