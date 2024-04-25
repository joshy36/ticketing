'use client';

import { Button } from '~/components/ui/button';
import { formatEthAddress } from '~/utils/helpers';
import { UserProfile } from 'supabase';
import { Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CopyWallet({
  userProfile,
}: {
  userProfile: UserProfile | null | undefined;
}) {
  const [copy, setCopy] = useState(false);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            className='max-w-[200px] gap-2 font-light text-muted-foreground'
            onClick={() => {
              navigator.clipboard.writeText(userProfile?.wallet_address!);
              setCopy(true);
              toast.success('Copied!');
            }}
          >
            {formatEthAddress(userProfile?.wallet_address!)}
            <Copy className='h-3 w-3' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copy ? 'Copied!' : 'Copy'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
