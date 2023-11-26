'use client';

import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { createComponents } from './NavBar';
import { mainComponents } from './NavBar';
import { cn } from './ui/utils';
import { Button, buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { CommandMenu } from './ui/command-menu';
import { UserNav } from './UserNav';
import { User } from '@supabase/supabase-js';
import { UserProfile } from 'supabase';

export function MobileNav({
  user,
  userProfile,
}: {
  user: User | undefined;
  userProfile: UserProfile | null;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className='sticky top-0 z-40 flex border-b bg-black/80 p-2 backdrop-blur transition-colors duration-500 md:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            className='mr-2 pr-4 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
          >
            <HamburgerMenuIcon className='h-5 w-5' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='pr-0'>
          {/* <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink> */}
          <ScrollArea className='my-4 h-[calc(100vh-8rem)] pb-10 pl-6'>
            <div className='flex flex-col space-y-3 pb-3'>
              {mainComponents.map((item) => (
                <div key={item.href}>
                  {item.title === 'My Tickets' && !user ? (
                    <div key={item.href}></div>
                  ) : (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                  )}
                </div>
              ))}
            </div>
            {user ? (
              <div className='flex flex-col space-y-3'>
                {createComponents.map(
                  (item) =>
                    item.href && (
                      <MobileLink
                        key={item.href}
                        href={item.href}
                        onOpenChange={setOpen}
                      >
                        {item.title}
                      </MobileLink>
                    ),
                )}
              </div>
            ) : (
              <div></div>
            )}

            <div className='flex flex-col space-y-2'>
              {/* {docsConfig.sidebarNav.map((item, index) => (
              <div key={index} className="flex flex-col space-y-3 pt-6">
                <h4 className="font-medium">{item.title}</h4>
                {item?.items?.length &&
                  item.items.map((item) => (
                    <React.Fragment key={item.href}>
                      {!item.disabled &&
                        (item.href ? (
                          <MobileLink
                            href={item.href}
                            onOpenChange={setOpen}
                            className="text-muted-foreground"
                          >
                            {item.title}
                          </MobileLink>
                        ) : (
                          item.title
                        ))}
                    </React.Fragment>
                  ))}
              </div>
            ))} */}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className='flex flex-1 items-center justify-between space-x-6 md:hidden md:justify-end'>
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

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
