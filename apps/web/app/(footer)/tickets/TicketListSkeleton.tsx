import { Skeleton } from '~/components/ui/skeleton';

export default function TicketListSkeleton() {
  return (
    <div className='flex flex-row items-center gap-5 border-b p-4'>
      <Skeleton className='h-24 w-24 rounded-md' />
      <div className='space-y-2'>
        <Skeleton className='h-5 w-[225px]' />
        <Skeleton className='h-4 w-[150px]' />
      </div>
    </div>
  );
}
