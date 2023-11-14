import { useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { blurhash } from '../../../utils/helpers';
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
    <View className="flex-1 bg-black px-4 items-center ">
      {ticketLoading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        <View>
          <Image
            style={{ borderRadius: 16 }}
            className="h-40 w-40 flex justify-center items-center pb-8"
            source={{ uri: ticket.events?.image! }}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
          <View className="flex flex-col py-4">
            <View>
              <Text className="text-white pl-2 text-2xl text-bold">
                {ticket.events?.name}
              </Text>
            </View>
            <View>
              <Text className="text-muted-foreground pl-2">
                {`Seat: ${ticket.seat}`}
              </Text>
            </View>
            <View>
              <Text className="text-muted-foreground pl-2">
                {/* {`QR: ${ticket.qr_code}`} */}
                {/* {`QR: ${qr}`} */}
              </Text>
            </View>
          </View>

          {qr ? (
            <View className="flex items-center justify-center bg-white p-4">
              <QRCode value={qr} />
            </View>
          ) : (
            <View className="flex items-center justify-center pt-4">
              <Pressable
                className="bg-white py-3 rounded-xl flex w-24 justify-end"
                // disabled={isLoading}
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
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Home;
