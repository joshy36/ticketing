'use client';

import { trpc } from '~/app/_trpc/client';

export default function Points({ userProfile }: { userProfile: any }) {
  const { data: platformPoints } = trpc.getPlatformPointsForUser.useQuery({
    user_id: userProfile?.id!,
  });

  return (
    <div>
      <p>Platform Points: {platformPoints}</p>
    </div>
  );
}
