'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DialogProps } from '@radix-ui/react-alert-dialog';

import { cn } from './utils';
import { Button } from './button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';
import { Icons } from './icons';
import { SearchIcon } from 'lucide-react';
import { trpc } from '../../../../apps/web/app/_trpc/client';
import Image from 'next/image';
import { dateToString } from '../../utils/helpers';
import { Artist, UserProfile, Venue } from 'supabase';
import ProfileCard from '../ProfileCard';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

  const { data: artists, isLoading: artistsLoading } =
    trpc.getArtists.useQuery();

  const { data: venues, isLoading: venuesLoading } = trpc.getVenues.useQuery();

  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <div className=''>
      <Button
        className={cn(
          'relative w-full justify-start bg-zinc-700/50 text-sm text-muted-foreground hover:bg-transparent hover:bg-zinc-800 sm:pr-12 md:w-40 lg:w-64',
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className='pr-2 lg:inline-flex'>
          <SearchIcon className='h-4 w-4' />
        </span>
        <span className='hidden lg:inline-flex'>Search events, artists...</span>
        <span className='inline-flex lg:hidden'>Search...</span>
        {/* <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd> */}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search events, artists, venues, and users' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {!events ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading='Events'>
              {events
                // .filter((navitem: any) => !navitem.external)
                .map((navItem: any) => (
                  <CommandItem
                    key={navItem.id}
                    value={navItem.name}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(`/event/${navItem.id}` as string),
                      );
                    }}
                  >
                    {navItem.image ? (
                      <Image
                        src={navItem.image}
                        alt={navItem.description}
                        width={500}
                        height={500}
                        className='mr-4 h-12 w-12'
                      />
                    ) : (
                      <Image
                        src='/fallback.jpeg'
                        alt='image'
                        width={500}
                        height={500}
                        className='mr-4 h-12 w-12'
                      />
                    )}
                    {/* <FileIcon className="mr-2 h-4 w-4" /> */}
                    <div>
                      <div className='text-lg'>{navItem.name}</div>
                      <div className='text-muted-foreground'>
                        {dateToString(navItem.date)}
                      </div>
                      <div className='text-muted-foreground'>
                        {navItem.venues.name}
                      </div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {!artists ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading='Artists'>
              {artists
                // .filter((navitem: any) => !navitem.external)
                .map((navItem: Artist) => (
                  <CommandItem
                    key={navItem.id}
                    value={navItem.name}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(`/artist/${navItem.id}` as string),
                      );
                    }}
                  >
                    {navItem.image ? (
                      <Image
                        src={navItem.image}
                        alt={navItem.description}
                        width={500}
                        height={500}
                        className='mr-4 h-12 w-12'
                      />
                    ) : (
                      <Image
                        src='/fallback.jpeg'
                        alt='image'
                        width={500}
                        height={500}
                        className='mr-4 h-12 w-12'
                      />
                    )}
                    {/* <FileIcon className="mr-2 h-4 w-4" /> */}
                    <div>
                      <div className='text-lg'>{navItem.name}</div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {!venues ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading='Venues'>
              {venues
                // .filter((navitem: any) => !navitem.external)
                .map((navItem: Venue) => (
                  <CommandItem
                    key={navItem.id}
                    value={navItem.name}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(`/venue/${navItem.id}` as string),
                      );
                    }}
                  >
                    {navItem.image ? (
                      <Image
                        src={navItem.image}
                        alt={navItem.description}
                        width={500}
                        height={500}
                        className='mr-4 h-12 w-12'
                      />
                    ) : (
                      <Image
                        src='/fallback.jpeg'
                        alt='image'
                        width={500}
                        height={500}
                        className='mr-4 h-12 w-12'
                      />
                    )}
                    {/* <FileIcon className="mr-2 h-4 w-4" /> */}
                    <div>
                      <div className='text-lg'>{navItem.name}</div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {!users ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading='Users'>
              {users
                // .filter((navitem: any) => !navitem.external)
                .map((navItem: UserProfile) => (
                  <CommandItem
                    key={navItem.id}
                    value={
                      navItem.first_name +
                      ' ' +
                      navItem.last_name +
                      ' ' +
                      navItem.username
                    }
                    onSelect={() => {
                      runCommand(() =>
                        router.push(`/${navItem.username}` as string),
                      );
                    }}
                  >
                    <ProfileCard userProfile={navItem} />
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {/* {docsConfig.sidebarNav.map((group: any) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem: any) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    <CircleIcon className="h-3 w-3" />
                  </div>
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))} */}
          {/* <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
