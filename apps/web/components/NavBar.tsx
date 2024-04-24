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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { cn } from './ui/utils';
import * as React from 'react';
import { Button } from './ui/button';
import { User } from '@supabase/supabase-js';
import { UserNav } from './UserNav';
import { CommandMenu } from './ui/command-menu';
import { UserProfile } from 'supabase';
import Image from 'next/image';
import { useContext } from 'react';
import { MessagesContext } from '@/providers/messagesProvider';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

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
  const {
    chats,
    unreadMessages,
    numberOfUnreadMessagesPerChat,
    mostRecentMessageByChat,
    setNumberOfUnreadMessagesPerChat,
  } = useContext(MessagesContext);
  const pathname = usePathname();
  const router = useRouter();
  const readMessages = trpc.readMessages.useMutation();

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
      href: '/tickets',
    },
  ];

  const chatsWithUnreadMessages = chats?.chats
    ?.filter((chat) => chat.chat_type === 'organization')
    .map((chat) => ({
      ...chat,
      numberUnread: numberOfUnreadMessagesPerChat?.[chat.id]?.unread || 0,
      mostRecentMessageContent: mostRecentMessageByChat?.[chat.id]?.message!,
      mostRecentMessageTimestamp:
        mostRecentMessageByChat?.[chat.id]?.created_at!,
      mostRecentMessageEventId: mostRecentMessageByChat?.[chat.id]?.event_id!,
    }))
    .filter((chat) => chat.numberUnread > 0)
    .sort(
      (a, b) =>
        new Date(b.mostRecentMessageTimestamp).getTime() -
        new Date(a.mostRecentMessageTimestamp).getTime(),
    );

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
            {user && (
              <NavigationMenuItem>
                <Link
                  href={`/${userProfile?.username}/id`}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className='flex flex-row items-center gap-2'>
                      <p>Scan In</p>
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {user && (
              <NavigationMenuItem>
                <Link href={`/messages`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className='flex flex-row items-center gap-2'>
                      <p>Messages</p>
                      {unreadMessages > 0 && (
                        <span className='flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-xs font-light'>
                          {unreadMessages}
                        </span>
                      )}
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
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
              {/* <MessageCenter /> */}
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

      {chatsWithUnreadMessages &&
        chatsWithUnreadMessages?.length > 0 &&
        (pathname === '/' || pathname === '/event/list') && (
          <div className='flex justify-center'>
            <AlertDialog>
              <AlertDialogTrigger
                onClick={() => {
                  readMessages.mutate({
                    chat_id: chatsWithUnreadMessages[0]?.id!,
                  });
                }}
                className='fixed z-40 mt-24 flex max-w-[350px] items-center justify-center rounded-full bg-black/50 p-2 backdrop-blur-sm'
              >
                {/* <div className='fixed z-40 mt-24 flex max-w-[350px] items-center justify-center rounded-full bg-black/50 p-2 backdrop-blur-sm'> */}
                <span className='mr-3 flex rounded-full bg-gradient-to-r from-red-700 via-orange-600 to-yellow-500 px-2 py-1 text-sm font-semibold uppercase'>
                  New
                </span>
                <span className='mr-2 flex-auto truncate text-ellipsis text-left '>
                  {chatsWithUnreadMessages[0]?.mostRecentMessageContent}
                </span>
                <svg
                  className='h-4 w-4 fill-current'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                >
                  <path d='M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z' />
                </svg>
                {/* </div> */}
              </AlertDialogTrigger>
              <AlertDialogContent className='bg-black/40'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Message</AlertDialogTitle>
                  <AlertDialogDescription>
                    {chatsWithUnreadMessages[0]?.mostRecentMessageContent}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-row items-center justify-between gap-2'>
                  <AlertDialogCancel
                    onClick={() => {
                      setNumberOfUnreadMessagesPerChat((prevState) => ({
                        ...prevState,
                        [chatsWithUnreadMessages[0]?.id!]: {
                          unread: 0,
                        },
                      }));
                    }}
                  >
                    Close
                  </AlertDialogCancel>

                  <div className='flex gap-2'>
                    <AlertDialogAction
                      onClick={() => {
                        router.push(
                          `/event/${chatsWithUnreadMessages[0]?.mostRecentMessageEventId}`,
                        );
                        setNumberOfUnreadMessagesPerChat((prevState) => ({
                          ...prevState,
                          [chatsWithUnreadMessages[0]?.id!]: {
                            unread: 0,
                          },
                        }));
                      }}
                      className='items-center gap-2'
                    >
                      View Event
                      <ChevronRight className='h-4 w-4' />
                    </AlertDialogAction>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
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
