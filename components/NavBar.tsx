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

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Create Event',
    href: '/event/create',
    description: 'A page to create an event.',
  },
  {
    title: 'Update Event',
    href: '/event/update',
    description: 'A page to update and event.',
  },
];

export default function NavBar({ user }: { user: User | null }) {
  return (
    <div className="flex h-16 items-center px-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Event Managment</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
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
        </NavigationMenuList>
      </NavigationMenu>
      {user ? (
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      ) : (
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/sign-in">
            {' '}
            <Button className={cn(buttonVariants({ variant: 'default' }))}>
              Sign In
            </Button>
          </Link>
        </div>
      )}
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
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
