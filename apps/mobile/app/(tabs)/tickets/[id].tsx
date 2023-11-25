import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { blurhash, dateToString } from '../../../utils/helpers';
import { useContext, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Separator from '../../components/Separator';
import { SupabaseContext } from '../../../utils/supabaseProvider';

const Home = () => {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qr, setQR] = useState<string>('');
  const [front, setFront] = useState<boolean>(true);
  const supabaseContext = useContext(SupabaseContext);
  const { user } = supabaseContext;
  const { data: ticket, isLoading: ticketLoading } =
    trpc.getTicketById.useQuery({
      id: id as string,
    });
  const { data: event } = trpc.getEventById.useQuery(
    { id: ticket?.event_id! },
    { enabled: !!ticket }
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
        console.error('Error activating ticket:', error);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setQR(data!);
      }
    },
  });

  useEffect(() => {
    if (ticket?.qr_code) {
      setQR(ticket.qr_code);
    }
  }, [ticket]);

  return (
    <View className="flex-1 bg-black p-4 items-center">
      <ScrollView>
        <View className="max-w-[50px] pb-2 ">
          <TouchableOpacity
            className="bg-white py-3 rounded-xl"
            onPress={() => setFront(!front)}
          >
            <Text className="text-black text-center font-bold">Flip</Text>
          </TouchableOpacity>
        </View>

        <View>
          {front ? (
            <View className="bg-zinc-950 p-4 border rounded-xl border-zinc-800 w-[300px]">
              {ticketLoading ? (
                <Text className="text-white">Loading...</Text>
              ) : (
                <View>
                  <View className="flex flex-col py-4">
                    <View>
                      <Text className="text-white pl-2 text-2xl font-bold">
                        {ticket?.events?.name}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-muted-foreground pl-2">
                        {`Seat: ${ticket?.seat}`}
                      </Text>
                    </View>
                  </View>
                  <Image
                    className="h-64 w-64 self-center items-center "
                    source={{
                      uri: ticket?.events?.image!,
                    }}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                  />
                  {qr ? (
                    <View className="flex items-center bg-white p-4">
                      <QRCode value={qr} />
                    </View>
                  ) : (
                    <View className="flex items-center justify-center pt-4">
                      <TouchableOpacity
                        className="bg-white py-3 rounded-xl flex w-24 justify-end"
                        onPress={() => {
                          setIsLoading(true);

                          activateTicket.mutate({
                            user_id: user?.id!,
                            ticket_id: ticket!.id,
                          });
                        }}
                      >
                        <Text className="text-black text-center font-bold">
                          Activate
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text className="text-muted-foreground  pt-4">
                    {dateToString(ticket?.events?.date!)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="bg-zinc-950 p-4 border rounded-xl border-zinc-800 w-[300px]">
              {ticketLoading ? (
                <Text className="text-white">Loading...</Text>
              ) : (
                <View>
                  <View className="flex flex-col py-4">
                    <View>
                      <Text className="text-white pl-2 text-2xl font-bold">
                        {ticket?.events?.name}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-muted-foreground pl-2">
                        {`Seat: ${ticket?.seat}`}
                      </Text>
                    </View>
                  </View>
                  <View className="pb-4 pl-4">
                    <Text className="pb-4 text-2xl text-white">Artist</Text>
                    <View className="flex flex-row items-center justify-start">
                      <Image
                        className="h-12 w-12 self-center items-center rounded-full"
                        source={{
                          uri: artist?.image!,
                        }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                      />
                      <Text className="pl-4 text-muted-foreground">
                        {artist?.name}
                      </Text>
                    </View>
                  </View>
                  <Separator />
                  <Text className="py-4 text-2xl pl-4 text-white">Venue</Text>
                  <Text className="text-muted-foreground pl-4">
                    {venue?.name}
                  </Text>
                  <Text className="text-muted-foreground pt-4">
                    {dateToString(ticket?.events?.date!)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
