import { Skeleton } from '~/components/ui/skeleton';

export default function ChatProfileCardSkeleton() {
  return (
    <div className='flex flex-row items-center gap-5 p-4'>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[225px]' />
        <Skeleton className='h-3 w-[150px]' />
      </div>
    </div>
  );
}
