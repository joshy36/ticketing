'use client';

import { Organization } from 'supabase';
import OrganizationName from './OrganizationName';
import OrganizationMembers from './OrganizationMembers';
import { trpc } from '~/app/_trpc/client';

export default function ManageOrg({
  organization_id,
}: {
  organization_id: string;
}) {
  const { data: organization } = trpc.getOrganizationById.useQuery({
    organization_id: organization_id,
  });

  return (
    <div>
      <OrganizationName organization={organization} />
      <OrganizationMembers organization={organization} />
    </div>
  );
}
