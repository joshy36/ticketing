'use client';

import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { CommandMenu } from './ui/command-menu';
import { UserNav } from './UserNav';
import { User } from '@supabase/supabase-js';
import { UserProfile } from 'supabase';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { MessageCircle } from 'lucide-react';
import { useContext } from 'react';
import { MessagesContext } from '../providers/messagesProvider';
import { trpc } from '../app/_trpc/client';
import { FriendRequestContext } from '../providers/friendRequestsProvider';
import { TicketsContext } from '../providers/ticketsProvider';

export function MobileNav({
  user,
  userProfile,
  userOrg,
}: {
  user: User | undefined;
  userProfile: UserProfile | null;
  userOrg: string | null | undefined;
}) {
  const [open, setOpen] = React.useState(false);
  const { unreadMessages } = useContext(MessagesContext);
  const { friendRequests } = useContext(FriendRequestContext);
  const { pendingPushRequsts, numberOfTicketsNeedToTransfer } =
    useContext(TicketsContext);

  const mainComponents: {
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
  ];

  return (
    <div className='fixed top-0 z-40 flex w-full items-center bg-black/50 p-2 backdrop-blur-md transition-colors duration-500 md:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className='relative'>
            <Button
              variant='ghost'
              className='mr-2 pr-4 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
            >
              <HamburgerMenuIcon className='h-5 w-5' />

              <span className='sr-only'>Toggle Menu</span>
            </Button>
            {pendingPushRequsts &&
              pendingPushRequsts?.length + numberOfTicketsNeedToTransfer >
                0 && (
                <span className='absolute right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-700 text-xs font-light'>
                  {pendingPushRequsts?.length + numberOfTicketsNeedToTransfer}
                </span>
              )}
          </div>
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
                  {item.title === 'Upcomding Events' && !user ? (
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
            {user && (
              <MobileLink
                href={`/${userProfile?.username}/id`}
                onOpenChange={setOpen}
              >
                <div className='flex flex-row items-center gap-2 pb-3'>
                  <p>Scan In</p>
                </div>
              </MobileLink>
            )}
            {user && (
              <MobileLink href={`/tickets`} onOpenChange={setOpen}>
                <div className='flex flex-row items-center gap-2 pb-3'>
                  <p>Upcoming Events</p>
                  {pendingPushRequsts &&
                    pendingPushRequsts?.length + numberOfTicketsNeedToTransfer >
                      0 && (
                      <span className='flex h-4 w-4 items-center justify-center rounded-full bg-red-700 text-xs font-light'>
                        {pendingPushRequsts?.length +
                          numberOfTicketsNeedToTransfer}
                      </span>
                    )}
                </div>
              </MobileLink>
            )}
            {user && (
              <MobileLink href={`/messages`} onOpenChange={setOpen}>
                <div className='flex flex-row items-center gap-2 pb-3'>
                  <p>Messages</p>
                  {friendRequests &&
                    unreadMessages + friendRequests?.length > 0 && (
                      <span className='flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-xs font-light'>
                        {unreadMessages + friendRequests?.length}
                      </span>
                    )}
                </div>
              </MobileLink>
            )}
            <div className=''></div>
            {userOrg && (
              <MobileLink href={`/dashboard/${userOrg}`} onOpenChange={setOpen}>
                Admin Dashboard
              </MobileLink>
            )}
            {/* {user ? (
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
            )} */}

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
          <div className='ml-auto mt-1.5 flex space-x-4'>
            {/* <MessageCenter /> */}
            <MobileLink href='/messages' onOpenChange={setOpen}>
              <div className='relative'>
                <Button
                  variant='outline'
                  size='icon'
                  className='border-none bg-zinc-700/50'
                >
                  <MessageCircle className='h-4 w-4' />
                </Button>
                {friendRequests &&
                  unreadMessages + friendRequests?.length > 0 && (
                    <span className='absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-xs font-light'>
                      {unreadMessages + friendRequests?.length}
                    </span>
                  )}
              </div>
            </MobileLink>
            <UserNav user={user} userProfile={userProfile} />
          </div>
        ) : (
          <div className='ml-auto flex items-center space-x-4 '>
            <Link href='/sign-in'>
              <Button variant='secondary'>Sign In</Button>
            </Link>
            <Link href='/sign-up'>
              <Button className='bg-white'>Sign Up</Button>
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
