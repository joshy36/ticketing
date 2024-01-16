import { ReactNode } from 'react';
import '../../app/globals.css';
import { cn } from './utils';

// https://marquee-dev.vercel.app/

export function Marquee({
  children,
  direction = 'left',
  pauseOnHover = false,
  reverse = false,
  fade = false,
  className,
  innerClassName,
  numberOfCopies = 2,
}: {
  children: ReactNode;
  direction?: 'left' | 'up';
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
  className?: string;
  innerClassName?: string;
  numberOfCopies?: number;
}) {
  return (
    <div
      className={cn(
        'group flex gap-[1rem] overflow-hidden',
        direction === 'left' ? 'flex-row' : 'flex-col',
        className,
      )}
      style={{
        maskImage: fade
          ? `linear-gradient(${
              direction === 'left' ? 'to right' : 'to bottom'
            }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
          : undefined,
        WebkitMaskImage: fade
          ? `linear-gradient(${
              direction === 'left' ? 'to right' : 'to bottom'
            }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
          : undefined,
      }}
    >
      {Array(numberOfCopies)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex shrink-0 justify-around gap-[1rem] [--gap:1rem]',
              direction === 'left'
                ? 'animate-marquee-left flex-row'
                : 'animate-marquee-up flex-col',
              pauseOnHover && 'group-hover:[animation-play-state:paused]',
              reverse && 'direction-reverse',
              innerClassName,
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
