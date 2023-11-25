import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { blurhash, dateToString } from '../../../utils/helpers';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const Home = () => {
  const { id } = useLocalSearchParams();
  const [qr, setQR] = useState<string>('');
  const { data: ticket, isLoading: ticketLoading } =
    trpc.getTicketById.useQuery({
      // @ts-ignore
      id: id!,
    });

  useEffect(() => {
    if (ticket?.qr_code) {
      setQR(ticket.qr_code);
    }
  }, [ticket]);

  return (
    <View className="flex-1 bg-black p-4 items-center">
      <ScrollView>
        <View className="bg-zinc-950 p-4 border rounded-xl border-zinc-800">
          {ticketLoading ? (
            <Text className="text-white">Loading...</Text>
          ) : (
            <View>
              <View className="flex flex-col py-4">
                <View>
                  <Text className="text-white pl-2 text-2xl font-bold">
                    {ticket.events?.name}
                  </Text>
                </View>
                <View>
                  <Text className="text-muted-foreground pl-2">
                    {`Seat: ${ticket.seat}`}
                  </Text>
                </View>
              </View>
              <View className="flex justify-center items-cent">
                <Image
                  className="h-64 w-64 self-center items-center "
                  source={{
                    uri: ticket.events?.image!,
                  }}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                />
              </View>
              {qr ? (
                <View className="flex items-center justify-center bg-white p-4">
                  <QRCode value={qr} />
                </View>
              ) : (
                <View className="flex items-center justify-center pt-4">
                  <TouchableOpacity
                    className="bg-white py-3 rounded-xl flex w-24 justify-end"
                    onPress={() => {
                      alert('Test');
                      //   setIsLoading(true);

                      //   activateTicket.mutate({
                      //     user_id: userProfile.id,
                      //     ticket_id: ticket!.id,
                      //   });
                    }}
                  >
                    <Text className="text-black text-center font-bold">
                      Activate
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text className="text-muted-foreground  pt-4">
                {dateToString(ticket.events?.date!)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
