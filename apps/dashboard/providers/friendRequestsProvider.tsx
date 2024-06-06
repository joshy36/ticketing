'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import { RouterOutputs, trpc } from '../app/_trpc/client';

type FriendRequestProviderProps = {
  children: React.ReactNode;
};

type FriendRequestContextProps = {
  friendRequests: RouterOutputs['getPendingFriendRequestsForUser'];
  setFriendRequests: Dispatch<
    SetStateAction<RouterOutputs['getPendingFriendRequestsForUser']>
  >;
  friendRequestsLoading: boolean;
};

export const FriendRequestContext = createContext<FriendRequestContextProps>({
  friendRequests: [],
  setFriendRequests: () => {},
  friendRequestsLoading: false,
});

export const FriendRequestProvider = ({
  children,
}: FriendRequestProviderProps) => {
  const [friendRequests, setFriendRequests] = useState<
    RouterOutputs['getPendingFriendRequestsForUser']
  >([]);
  const { data: requests, isLoading: friendRequestsLoading } =
    trpc.getPendingFriendRequestsForUser.useQuery();

  useEffect(() => {
    if (requests) {
      setFriendRequests(requests);
    }
  }, [requests]);

  return (
    <FriendRequestContext.Provider
      value={{ friendRequests, setFriendRequests, friendRequestsLoading }}
    >
      {children}
    </FriendRequestContext.Provider>
  );
};
