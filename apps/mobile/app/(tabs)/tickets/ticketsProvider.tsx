import { createContext } from 'react';
import { RouterOutputs, trpc } from '../../../utils/trpc';
import { UserProfile } from 'supabase';

type TicketsProviderProps = {
  children: React.ReactNode;
  userProfile: UserProfile | null | undefined;
};

type TicketsContextProps = {
  userProfile: UserProfile | null | undefined;
  upcomingEvents: RouterOutputs['getUpcomingEventsForUser'] | undefined;
  upcomingEventsLoading: boolean;
  tickets: RouterOutputs['getTicketsForUser'] | undefined;
  refetchUpcomingEvents: () => Promise<any>;
  refetchTickets: () => Promise<any>;
};

export const TicketsContext = createContext<TicketsContextProps>({
  userProfile: null,
  upcomingEvents: [],
  upcomingEventsLoading: false,
  tickets: undefined,
  refetchUpcomingEvents: async () => {},
  refetchTickets: async () => {},
});

export const TicketsProvider = ({
  children,
  userProfile,
}: TicketsProviderProps) => {
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

  return (
    <TicketsContext.Provider
      value={{
        userProfile,
        upcomingEvents,
        upcomingEventsLoading,
        tickets,
        refetchUpcomingEvents,
        refetchTickets,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};
