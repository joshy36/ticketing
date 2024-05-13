import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import { RouterOutputs, trpc } from '../../../utils/trpc';

type FriendRequestProviderProps = {
  children: React.ReactNode;
};

type FriendRequestContextProps = {
  friendRequests: RouterOutputs['getPendingFriendRequestsForUser'];
  setFriendRequests: Dispatch<
    SetStateAction<RouterOutputs['getPendingFriendRequestsForUser']>
  >;
  friendRequestsLoading: boolean;
  refetchFriendRequests: () => Promise<any>;
};

export const FriendRequestContext = createContext<FriendRequestContextProps>({
  friendRequests: [],
  setFriendRequests: () => {},
  friendRequestsLoading: false,
  refetchFriendRequests: async () => {},
});

export const FriendRequestProvider = ({
  children,
}: FriendRequestProviderProps) => {
  const [friendRequests, setFriendRequests] = useState<
    RouterOutputs['getPendingFriendRequestsForUser']
  >([]);
  const {
    data: requests,
    isLoading: friendRequestsLoading,
    refetch: refetchFriendRequests,
  } = trpc.getPendingFriendRequestsForUser.useQuery();

  console.log('requests', requests);

  useEffect(() => {
    if (requests) {
      setFriendRequests(requests);
    }
  }, [requests]);

  return (
    <FriendRequestContext.Provider
      value={{
        friendRequests,
        setFriendRequests,
        friendRequestsLoading,
        refetchFriendRequests,
      }}
    >
      {children}
    </FriendRequestContext.Provider>
  );
};
