import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { blurhash, dateToString } from '../../../utils/helpers';
import { useContext, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Separator from '../../components/Separator';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qr, setQR] = useState<string>('');
  const [front, setFront] = useState<boolean>(true);
  const [ticketNumber, setTicketNumber] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const supabaseContext = useContext(SupabaseContext);
  const { user } = supabaseContext;

  const { data: tickets, isLoading: ticketsLoading } =
    trpc.getTicketsForUserByEvent.useQuery({
      event_id: id as string,
      user_id: user?.id!,
    });

  const { data: event } = trpc.getEventById.useQuery(
    { id: id as string },
    { enabled: !!tickets }
  );
  const { data: artist } = trpc.getArtistById.useQuery(
    { id: event?.artist! },
    { enabled: !!event }
  );
  const { data: venue } = trpc.getVenueById.useQuery(
    { id: event?.venue! },
    { enabled: !!event }
  );
  const activateTicket = trpc.generateTicketQRCode.useMutation({
    onSettled(data, error) {
      if (error) {
        if (error.message === 'Ticket already activated!') {
          setError('Ticket already activated, try refreshing!');
        } else {
          setError('Error activating ticket');
        }

        console.error('Error activating ticket:', error);
        setIsLoading(false);
      } else {
        // router.refresh();

        setIsLoading(false);
        setQR(data!);
        tickets![ticketNumber].qr_code = data!;
      }
    },
  });

  useEffect(() => {
    if (tickets) {
      setQR(tickets![ticketNumber].qr_code!);
    }
  }, [tickets]);

  return (
    <View className="flex-1 justify-center bg-black">
      {ticketsLoading ? (
        <Text className="text-white text-2xl">Loading...</Text>
      ) : (
        <View className="flex flex-row justify-center">
          <View
            key={tickets![ticketNumber]?.id}
            className="flex snap-center flex-col items-center justify-center"
          >
            <View className="flex flex-row items-center justify-between gap-16 pb-4">
              {ticketNumber !== 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    setTicketNumber(ticketNumber - 1);
                    setQR(tickets![ticketNumber - 1].qr_code!);
                  }}
                  className="rounded-md"
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={50}
                    color="white"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="invisible rounded-md">
                  <Ionicons
                    name="chevron-back-outline"
                    size={50}
                    color="white"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="rounded-full bg-white p-4"
                onPress={() => setFront(!front)}
              >
                <Text className="text-black text-center font-bold">Flip</Text>
              </TouchableOpacity>
              {ticketNumber < tickets!.length - 1 ? (
                <TouchableOpacity
                  onPress={() => {
                    setTicketNumber(ticketNumber + 1);
                    setQR(tickets![ticketNumber + 1].qr_code!);
                  }}
                  className="rounded-md"
                >
                  <Ionicons
                    name="chevron-forward-outline"
                    size={50}
                    color="white"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="invisible rounded-md">
                  <Ionicons
                    name="chevron-forward-outline"
                    size={50}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text className="pb-2 font-light text-muted-foreground">
              Ticket {ticketNumber + 1} of {tickets!.length}
            </Text>
            {front ? (
              <View className="border border-zinc-800 rounded-xl p-4 bg-zinc-950 w-full">
                <Text className="text-white font-bold text-2xl">
                  {tickets![ticketNumber]?.events?.name}
                </Text>
                <Text className="text-muted-foreground pb-4">
                  {`Seat: ${tickets![ticketNumber]!.seat}`}
                </Text>

                {/* <View className="py-4">
                  <Image
                    source={tickets![ticketNumber]!.events?.image}
                    alt="Ticket Image"
                    className="h-20 w-20"
                    placeholder={blurhash}
                  />
                </View> */}

                {qr ? (
                  <View className="flex items-center justify-center bg-white p-4">
                    <QRCode value={qr} />
                  </View>
                ) : (
                  <View className="pt-4">
                    <TouchableOpacity
                      disabled={isLoading}
                      className="w-full bg-white rounded-full p-2"
                      onPress={() => {
                        setIsLoading(true);

                        activateTicket.mutate({
                          user_id: user!.id,
                          ticket_id: tickets![ticketNumber]!.id,
                        });
                      }}
                    >
                      <Text className="text-black text-center font-bold">
                        Activate
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text className="text-sm font-light text-muted-foreground pt-4">
                  {dateToString(tickets![ticketNumber]?.events?.date!)}
                </Text>
              </View>
            ) : (
              <View className="border border-zinc-800 rounded-xl p-4 bg-zinc-950 w-full">
                <Text className="text-white font-bold text-2xl">
                  {tickets![ticketNumber]?.events?.name}
                </Text>
                <Text className="text-muted-foreground pb-4">{`Seat: ${
                  tickets![ticketNumber]!.seat
                }`}</Text>
                <View className="bg-zinc-950 p-2 ">
                  {/* <View>
              <p className="pb-4 text-2xl">Artist</p>

              <View className="flex flex-row items-center justify-start">
                <Avatar className="h-14 w-14">
                  {artist?.image ? (
                    <AvatarImage src={artist?.image} alt="pfp" />
                  ) : (
                    <AvatarFallback></AvatarFallback>
                  )}
                </Avatar>
                <p className="pl-4 text-muted-foreground">{artist?.name}</p>
              </View>
            </View> */}
                  {/* <Separator className="my-6" /> */}
                  <Text className="pb-4 text-2xl">Venue</Text>

                  <Text className="text-muted-foreground">{venue?.name}</Text>
                </View>
                <Text className="text-sm font-light text-muted-foreground pt-4">
                  {dateToString(tickets![ticketNumber]?.events?.date!)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Home;
