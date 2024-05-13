import { UserProfile } from 'supabase';
import { Image } from 'expo-image';
import {
  blurhash,
  dateToString,
  replaceLocalhostWithIP,
} from '../../../utils/helpers';
import { RouterOutputs, trpc } from '../../../utils/trpc';
import { ListItem } from '@rneui/themed';
import { Link, router } from 'expo-router';
import ProfileCard from '../../components/ProfileCard';
import { View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useContext, useEffect, useState } from 'react';
import { TicketsContext } from './ticketsProvider';

export default function TicketList({
  userProfile,
}: {
  userProfile: UserProfile | undefined | null;
}) {
  const { upcomingEvents, upcomingEventsLoading, tickets } =
    useContext(TicketsContext);

  const [expanded, setExpanded] = useState<boolean[]>([]);

  useEffect(() => {
    if (!upcomingEventsLoading && upcomingEvents?.length) {
      setExpanded(new Array(upcomingEvents.length).fill(false));
    }
  }, [upcomingEventsLoading, upcomingEvents]);

  const renderTicketRequest = (pending: any) => {
    if (pending.status === 'accepted') {
      return (
        <View className="flex flex-col gap-1">
          <Link
            href={`/${pending.to_profile.username}`}
            className="flex flex-col gap-2"
          >
            <ProfileCard userProfile={pending.to_profile} />
          </Link>
          <View className="flex flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-green-500"></View>
            <Text className="text-muted-foreground">Accepted</Text>
          </View>
        </View>
      );
    } else if (pending.status === 'rejected') {
      return (
        <View className="flex flex-row items-center gap-2 font-light text-red-600">
          {/* <AlertCircle className="h-4 w-4" /> */}
          <Text className="text-white">Rejected</Text>
        </View>
      );
    } else if (pending.status === 'pending') {
      return (
        <View className="flex flex-col gap-2">
          <Link
            href={`/${pending.to_profile.username}`}
            className="flex flex-row items-center"
          >
            <ProfileCard userProfile={pending.to_profile} />
          </Link>

          <View className="flex flex-row items-center justify-between gap-4">
            <View className="flex flex-row items-center gap-2 ">
              <View className="h-2 w-2 rounded-full bg-yellow-500"></View>
              <Text className="text-muted-foreground">Pending</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                router.push(`/tickets/cancel/${pending.ticket_id}`);
              }}
            >
              <View className="flex flex-row items-center p-2 text-yellow-500 border border-yellow-500 rounded-full">
                {/* <Feather name="x" size={16} /> */}
                <Text className="text-yellow-500">Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <View>
      {upcomingEvents?.length != 0 ? (
        <View>
          {upcomingEvents?.map((event, index) => (
            <View key={event?.id} className="border-b border-zinc-800">
              <ListItem.Accordion
                containerStyle={{ backgroundColor: 'black' }}
                content={
                  <>
                    <ListItem.Content>
                      <ListItem.Title>
                        <View className="flex flex-row items-center justify-between">
                          <View className="flex flex-row items-center justify-between">
                            <View className="flex flex-row gap-4">
                              <View>
                                {event?.image && (
                                  <Image
                                    style={{ borderRadius: 16 }}
                                    className="h-20 w-20"
                                    source={{
                                      uri: replaceLocalhostWithIP(event).image,
                                    }}
                                    placeholder={blurhash}
                                    contentFit="cover"
                                    transition={1000}
                                  />
                                )}
                              </View>
                              <View>
                                <Text className="mt-2 text-start text-xl text-accent-foreground text-white">
                                  {event?.name}
                                </Text>
                                <Text className="font-sm mt-0.5 text-start text-sm font-light text-muted-foreground">
                                  {`${dateToString(event?.date!)}`}
                                </Text>
                                <Text className="font-sm mt-0.5 text-start text-sm font-light text-muted-foreground">
                                  {`${event?.venues.name}`}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {tickets?.tickets
                            ?.filter((ticket) => ticket.event_id === event.id)
                            ?.filter(
                              (ticket) => ticket.owner_id !== userProfile?.id
                            )
                            ?.some(
                              (ticket) =>
                                !tickets.pushRequestTickets?.find(
                                  (ticketFind) =>
                                    ticketFind.ticket_id === ticket.id
                                )
                            ) && (
                            <View className="ml-8 px-2 py-1 flex flex-row items-center text-red-600 bg-red-800/40 rounded-full">
                              <Feather
                                name="alert-circle"
                                size={16}
                                color="red"
                              />
                              <Text className="text-red-600 text-sm pl-1">
                                Transfer
                              </Text>
                            </View>
                          )}
                        </View>
                      </ListItem.Title>
                    </ListItem.Content>
                  </>
                }
                isExpanded={expanded[index]}
                onPress={() => {
                  setExpanded((prev) =>
                    prev.map((value, i) => (i === index ? !value : value))
                  );
                }}
              >
                <View>
                  <View className="flex flex-row items-center justify-between border-b border-zinc-800 px-2 py-2">
                    <Text className="text-white">
                      {
                        tickets?.tickets?.filter(
                          (ticket) => ticket.owner_id === userProfile?.id
                        )[0]?.seat
                      }
                    </Text>
                    <Text className="text-white">Your Ticket</Text>
                  </View>
                  {tickets?.tickets
                    ?.filter((ticket) => ticket.event_id === event.id)
                    ?.filter((ticket) => ticket.owner_id !== userProfile?.id)
                    ?.map((ticket: any, index: number) => (
                      <View
                        key={ticket.id}
                        className="flex flex-row items-center justify-between border-b border-zinc-800 px-2 py-2"
                      >
                        <View className="flex items-center gap-8 font-medium">
                          <View className="flex flex-col">
                            <Text className="text-white">{ticket.seat}</Text>
                          </View>
                        </View>

                        {tickets.pushRequestTickets?.find(
                          (ticketFind) => ticketFind.ticket_id === ticket.id
                        ) ? (
                          renderTicketRequest(
                            tickets.pushRequestTickets?.find(
                              (ticketFind) => ticketFind.ticket_id === ticket.id
                            )
                          )
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              router.push(`/tickets/transfer/${ticket.id}`);
                            }}
                          >
                            <View className="flex flex-row border border-red-600 p-2 rounded-full">
                              <Feather
                                name="alert-circle"
                                size={16}
                                color="red"
                              />
                              <Text className="text-red-600 pl-1">
                                Transfer
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                </View>
              </ListItem.Accordion>
            </View>
          ))}
        </View>
      ) : (
        <View>
          <Text className="pt-12 text-3xl">No upcoming events</Text>
          <Text className="pt-2 font-light text-muted-foreground">
            Check out the events page to explore upcoming events
          </Text>
        </View>
      )}
    </View>
  );
}
