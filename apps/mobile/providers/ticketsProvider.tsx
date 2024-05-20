import { createContext, useContext, useEffect, useState } from 'react';
import { RouterOutputs, trpc } from '../utils/trpc';
import { SupabaseContext } from '@/utils/supabaseProvider';

type TicketsProviderProps = {
  children: React.ReactNode;
};

type TicketsContextProps = {
  upcomingEvents: RouterOutputs['getUpcomingEventsForUser'] | undefined;
  upcomingEventsLoading: boolean;
  tickets: RouterOutputs['getTicketsForUser'] | undefined;
  pendingPushRequsts:
    | RouterOutputs['getPendingTicketTransferPushRequests']
    | undefined;
  numberOfTicketsNeedToTransfer: number;
  refetchUpcomingEvents: () => Promise<any>;
  refetchTickets: () => Promise<any>;
  refetchPush: () => Promise<any>;
};

export const TicketsContext = createContext<TicketsContextProps>({
  upcomingEvents: [],
  upcomingEventsLoading: false,
  tickets: undefined,
  pendingPushRequsts: undefined,
  numberOfTicketsNeedToTransfer: 0,
  refetchUpcomingEvents: async () => {},
  refetchTickets: async () => {},
  refetchPush: async () => {},
});

export const TicketsProvider = ({ children }: TicketsProviderProps) => {
  const [numberOfTicketsNeedToTransfer, setNumberOfTicketsNeedToTransfer] =
    useState<number>(0);
  const { data: pendingPushRequsts, refetch: refetchPush } =
    trpc.getPendingTicketTransferPushRequests.useQuery();

  const { userProfile } = useContext(SupabaseContext);

  const {
    data: upcomingEvents,
    isLoading: upcomingEventsLoading,
    refetch: refetchUpcomingEvents,
  } = trpc.getUpcomingEventsForUser.useQuery({
    user_id: userProfile?.id!,
  });

  const { data: tickets, refetch: refetchTickets } =
    trpc.getTicketsForUser.useQuery(
      {
        user_id: userProfile?.id!,
      },
      { enabled: !!userProfile }
    );

  useEffect(() => {
    if (tickets) {
      let total = 0;
      for (const ticket of tickets.tickets!) {
        const req = tickets.pushRequestTickets?.find(
          (ticketFind) => ticketFind.ticket_id === ticket.id
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
        upcomingEvents,
        upcomingEventsLoading,
        tickets,
        pendingPushRequsts,
        numberOfTicketsNeedToTransfer,
        refetchUpcomingEvents,
        refetchTickets,
        refetchPush,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};
