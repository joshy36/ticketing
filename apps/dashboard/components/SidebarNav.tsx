'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from './ui/utils';
import { buttonVariants } from './ui/button';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 pt-20 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-zinc-800/40',
            'items-center justify-start gap-2 rounded-md text-muted-foreground',
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
