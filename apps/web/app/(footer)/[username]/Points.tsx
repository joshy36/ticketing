'use client';

import { trpc } from '~/app/_trpc/client';

export default function Points({ userProfile }: { userProfile: any }) {
  const { data: artistPoints } = trpc.getArtistPointsForUser.useQuery({
    user_id: userProfile?.id!,
  });

  const { data: venuePoints } = trpc.getVenuePointsForUser.useQuery({
    user_id: userProfile?.id!,
  });

  const { data: platformPoints } = trpc.getPlatformPointsForUser.useQuery({
    user_id: userProfile?.id!,
  });

  console.log('artistPoints: ', artistPoints);
  console.log('venuePoints: ', venuePoints);

  return (
    <div>
      <p>Platform Points: {platformPoints}</p>
      {artistPoints?.map((artistPoint: any) => (
        <p key={artistPoint.id}>
          {artistPoint.artists?.name}: {artistPoint.points}
        </p>
      ))}
      {venuePoints?.map((venuePoint: any) => (
        <p key={venuePoint.id}>
          {venuePoint.venues?.name}: {venuePoint.points}
        </p>
      ))}
    </div>
  );
}
