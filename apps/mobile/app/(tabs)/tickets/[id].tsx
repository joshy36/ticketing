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
import ProfileCard from '../../components/ProfileCard';
import { Ticket } from 'supabase';

const Home = () => {
  const { id } = useLocalSearchParams();
  const [front, setFront] = useState<boolean>(true);
  const supabaseContext = useContext(SupabaseContext);
  const { user } = supabaseContext;

  const { data: tickets, isLoading: ticketsLoading } =
    trpc.getTicketsForUserByEvent.useQuery({
      event_id: id as string,
      user_id: user?.id!,
    });

  const { data: userProfile } = trpc.getUserProfile.useQuery({ id: user?.id! });

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
  const { data: userQR } = trpc.getUserQRCode.useQuery({
    user_id: user?.id!,
  });

  return (
    <View className="flex-1 justify-center bg-black">
      {ticketsLoading ? (
        <Text className="text-white text-2xl">Loading...</Text>
      ) : (
        <View className="flex flex-row justify-center">
          <ScrollView className="px-4">
            <View className="flex snap-center flex-col items-center justify-center">
              <View className="flex flex-row items-center justify-between gap-16 pb-4">
                <TouchableOpacity
                  className="rounded-full bg-white p-4"
                  onPress={() => setFront(!front)}
                >
                  <Text className="text-black text-center font-bold">Flip</Text>
                </TouchableOpacity>
              </View>

              {front ? (
                <View className="border border-zinc-800 rounded-xl p-4 bg-zinc-950 w-full">
                  <Text className="text-white font-bold text-2xl">
                    {tickets?.ownedTicket?.events?.name}
                  </Text>
                  <Text className="text-muted-foreground pb-4">
                    {`Seat: ${tickets?.ownedTicket?.seat}`}
                  </Text>

                  <View className="py-4 flex items-center justify-center">
                    <Image
                      source={tickets?.ownedTicket?.events?.image}
                      alt="Ticket Image"
                      className="w-full h-64"
                      placeholder={blurhash}
                    />
                  </View>

                  {userQR && (
                    <View className="flex items-center justify-center bg-white p-4">
                      <QRCode value={userQR} />
                    </View>
                  )}

                  <Text className="text-sm font-light text-muted-foreground pt-4">
                    {dateToString(tickets?.ownedTicket?.events?.date!)}
                  </Text>
                </View>
              ) : (
                <View className="border border-zinc-800 rounded-xl p-4 bg-zinc-950 w-full">
                  <Text className="text-white font-bold text-2xl">
                    {tickets?.ownedTicket?.events?.name}
                  </Text>
                  <Text className="text-muted-foreground pb-4">{`Seat: ${tickets?.ownedTicket?.seat}`}</Text>
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
                    {dateToString(tickets?.ownedTicket?.events?.date!)}
                  </Text>
                </View>
              )}
            </View>

            {tickets?.tickets?.filter(
              (ticket) => ticket.owner_id !== userProfile?.id
            ).length! > 0 && (
              <View className="pt-8">
                <Text className="text-xl font-bold text-white">
                  Transferable Tickets
                </Text>
                <Text className="pb-4 text-sm font-light text-muted-foreground">
                  You must transfer these tickets to their respective owners
                  before the event begins for them to be allowed entry. This
                  will allow us to verify that the person entering the event is
                  the rightful owner of the ticket.
                </Text>
              </View>
            )}

            {tickets?.tickets
              ?.filter((ticket) => ticket.owner_id !== userProfile?.id)
              ?.map((ticket: Ticket, index: number) => (
                <View key={ticket.id}>
                  <View className="flex flex-row justify-between items-center border-b border-zinc-800 px-2 py-2">
                    <Text className="text-white">{ticket.seat}</Text>
                    {ticket.owner_id ? (
                      <View className="flex flex-row items-center gap-2 ">
                        {/* <CheckCircle className='h-4 w-4' /> */}
                        <Ionicons
                          name={'checkmark-circle-outline'}
                          size={25}
                          color={'#22c55e'}
                        />
                        <View>
                          <ProfileCard
                            userProfile={tickets.ownerProfiles[index]!}
                            imageSize={8}
                          />
                        </View>
                      </View>
                    ) : (
                      <View className="flex flex-row items-center gap-2 ">
                        <Ionicons
                          name={'alert-circle-outline'}
                          size={25}
                          color={'#eab308'}
                        />
                        <Text className="font-light text-yellow-500">
                          Not transferred
                        </Text>
                        <Link href={`/tickets/transfer/${ticket.id}`} asChild>
                          <TouchableOpacity className="bg-zinc-600/60 rounded-full py-3 px-4">
                            <Text className="text-white font-semibold">
                              Transfer
                            </Text>
                          </TouchableOpacity>
                        </Link>
                      </View>
                    )}
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Home;
