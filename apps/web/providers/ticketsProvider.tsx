'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import { RouterOutputs, trpc } from '../app/_trpc/client';
import { UserProfile } from 'supabase';

type TicketsProviderProps = {
  children: React.ReactNode;
  userProfile: UserProfile | null | undefined;
};

type TicketsContextProps = {
  pendingPushRequsts:
    | RouterOutputs['getPendingTicketTransferPushRequests']
    | undefined;
  refetchPush: () => void;
  tickets: RouterOutputs['getTicketsForUser'] | undefined;
  refetchTickets: () => void;
  numberOfTicketsNeedToTransfer: number;
};

export const TicketsContext = createContext<TicketsContextProps>({
  pendingPushRequsts: [],
  refetchPush: () => {},
  tickets: [],
  refetchTickets: () => {},
  numberOfTicketsNeedToTransfer: 0,
});

export const TicketsProvider = ({
  children,
  userProfile,
}: TicketsProviderProps) => {
  const [numberOfTicketsNeedToTransfer, setNumberOfTicketsNeedToTransfer] =
    useState<number>(0);
  const { data: pendingPushRequsts, refetch: refetchPush } =
    trpc.getPendingTicketTransferPushRequests.useQuery();

  const { data: tickets, refetch: refetchTickets } =
    trpc.getTicketsForUser.useQuery({
      user_id: userProfile?.id!,
    });

  useEffect(() => {
    if (tickets) {
      let total = 0;
      for (const ticket of tickets.tickets!) {
        const req = tickets.pushRequestTickets?.find(
          (ticketFind) => ticketFind.ticket_id === ticket.id,
        );
        if (!req && ticket.owner_id !== userProfile?.id!) {
          total++;
        }
      }
      setNumberOfTicketsNeedToTransfer(total);
    }
  }, [tickets]);

  return (
    <TicketsContext.Provider
      value={{
        pendingPushRequsts,
        refetchPush,
        tickets,
        refetchTickets,
        numberOfTicketsNeedToTransfer,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};
