import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { blurhash } from '../../utils/helpers';

const TicketsPage = ({
  tickets,
  ticketsLoading,
}: {
  tickets: any;
  ticketsLoading: Boolean;
}) => {
  return (
    <View className="flex-1 justify-center bg-black">
      {/* <Text className="text-white text-3xl font-bold">Upcoming Events</Text> */}
      <ScrollView>
        <View>
          {ticketsLoading ? (
            <Text className="text-white">Loading...</Text>
          ) : (
            tickets!.map((ticket: any) => (
              <View className="px-2 " key={ticket.id}>
                <Link href={`/tickets/${ticket.id}`}>
                  <View className="flex flex-row items-center py-3 ">
                    <View>
                      <Image
                        style={{ borderRadius: 16 }}
                        className="h-20 w-20"
                        source={{ uri: ticket.events?.image! }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                      />
                    </View>
                    <View className="flex flex-col">
                      <View>
                        <Text className="text-white pl-2 text-2xl text-bold">
                          {ticket.events?.name}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-muted-foreground pl-2">
                          {ticket.seat}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Link>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TicketsPage;
