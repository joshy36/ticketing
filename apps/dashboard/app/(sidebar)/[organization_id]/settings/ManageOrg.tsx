'use client';

import { Organization } from 'supabase';
import OrganizationName from './OrganizationName';
import OrganizationMembers from './OrganizationMembers';

export default function ManageOrg({
  organization,
}: {
  organization: Organization | null | undefined;
}) {
  return (
    <div>
      <OrganizationName organization={organization} />
      <OrganizationMembers organization={organization} />
    </div>
  );
}
