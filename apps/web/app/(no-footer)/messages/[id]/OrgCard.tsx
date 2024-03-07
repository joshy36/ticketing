import { Artist, Venue } from 'supabase';
import Image from 'next/image';

export default function OrgCard({
  artist,
  venue,
  mostRecentMessage,
}: {
  artist: Artist | null | undefined;
  venue: Venue | null | undefined;
  mostRecentMessage: string | null | undefined;
}) {
  const artistOrVenue = artist || venue;
  return (
    <div className='flex flex-row items-center gap-5'>
      {artistOrVenue?.image && (
        <Image
          src={artistOrVenue?.image!}
          alt='img'
          width={50}
          height={50}
          className='h-12 w-12 rounded-md object-contain'
        />
      )}
      <div className='flex max-w-[150px] flex-col justify-between'>
        <div className='flex items-center'>
          <p className='truncate text-ellipsis font-medium text-white'>
            {artistOrVenue?.name}
          </p>
        </div>
        <div>
          <p className='truncate text-ellipsis text-left text-sm font-light text-muted-foreground'>
            {mostRecentMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
