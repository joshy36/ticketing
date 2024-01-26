import { Link, router } from 'expo-router';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Separator from './Separator';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { User } from '@supabase/supabase-js';
import { Section } from '../(tabs)/home/[id]';
import { RouterOutputs } from 'api';
import { trpc } from '../../utils/trpc';
import { supabase } from '../../utils/supabaseExpo';
import ConfettiCannon from 'react-native-confetti-cannon';

const TicketSection = ({
  event,
  sections,
  user,
  tickets,
  refetch,
}: {
  event: RouterOutputs['getEventById'];
  sections: RouterOutputs['getSectionsForVenueWithPrices'];
  user: User | null;
  tickets: RouterOutputs['getAvailableTicketsForEvent'];
  refetch: any;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketQuantities, setTicketQuantities] = useState<{
    [id: string]: {
      quantity: number;
      section: Section;
    };
  }>({});

  const createPaymentIntent = trpc.createPaymentIntent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error fetching payment intent ticket:', error);
        alert(`Error!`);
      } else {
      }
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('test-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `event_id=eq.${event?.id}`,
        },
        (payload) => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets',
          filter: `event_id=eq.${event?.id}`,
        },
        (payload) => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const getTotalTicketCount = () => {
    return Object.values(ticketQuantities).reduce(
      (total, count) => total + count.quantity,
      0
    );
  };

  const handleAddTicket = (section: Section) => {
    const totalTickets = getTotalTicketCount();
    if (totalTickets < event?.max_tickets_per_user!) {
      setTicketQuantities((prevQuantities) => ({
        ...prevQuantities,
        [section.id!]: {
          quantity: (prevQuantities[section.id!]?.quantity || 0) + 1,
          section,
        },
      }));
    }
  };

  const handleRemoveTicket = (section: Section) => {
    setTicketQuantities((prevQuantities) => ({
      ...prevQuantities,
      [section.id!]: {
        quantity: Math.max((prevQuantities[section.id!]?.quantity || 0) - 1, 0),
        section,
      },
    }));
  };

  const getTotalPrice = () => {
    let totalPrice = 0;

    Object.keys(ticketQuantities).forEach((id) => {
      const quantity = ticketQuantities[id] || 0;
      const sectionPrice = ticketQuantities[id]?.section.price;

      if (sectionPrice) {
        totalPrice += quantity.quantity * sectionPrice;
      }
    });

    return totalPrice;
  };

  return (
    <View>
      {sections?.map((section) => (
        <View key={section.id} className="flex flex-row justify-between py-2">
          <View className="flex flex-col">
            <Text className="text-white text-xl">{section.name}</Text>
            <View>
              {!tickets ||
              tickets?.filter((ticket) => ticket.section_id === section.id)
                .length <= 0 ? (
                <Text className="text-red-700">Sold out</Text>
              ) : (
                <View>
                  <Text className="text font-light text-gray-400">
                    {`$` +
                      tickets?.find(
                        (ticket) => ticket.section_id === section.id
                      )?.price}
                  </Text>
                  {/* <Text className="text-white">
                    {`Amount left: ` +
                      tickets?.filter(
                        (ticket) => ticket.section_id === section.id
                      ).length}
                  </Text> */}
                </View>
              )}
            </View>
          </View>
          <View className="flex flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => {
                handleRemoveTicket(section);
              }}
              disabled={
                !ticketQuantities[section.id!] ||
                ticketQuantities[section.id!]?.quantity! <= 0
              }
              style={
                !ticketQuantities[section.id!] ||
                ticketQuantities[section.id!]?.quantity! <= 0
                  ? { opacity: 0.5 } // Set the desired opacity for the disabled state
                  : {} // Default styles when not disabled
              }
            >
              <Ionicons name="remove-circle" size={50} color="white" />
            </TouchableOpacity>
            <Text className="text-white px-2">
              {ticketQuantities[section.id!]?.quantity || 0}
            </Text>
            <TouchableOpacity
              onPress={() => {
                handleAddTicket(section);
              }}
              disabled={
                getTotalTicketCount() >= event?.max_tickets_per_user! ||
                !tickets ||
                tickets?.filter((ticket) => ticket.section_id === section.id)
                  .length <= 0
              }
              style={
                getTotalTicketCount() >= event?.max_tickets_per_user! ||
                !tickets ||
                tickets?.filter((ticket) => ticket.section_id === section.id)
                  .length <= 0
                  ? { opacity: 0.5 } // Set the desired opacity for the disabled state
                  : {} // Default styles when not disabled
              }
            >
              <Ionicons name="add-circle" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {getTotalTicketCount() >= event?.max_tickets_per_user! ? (
        <View>
          <Text className="text-white text-center">
            Max {event?.max_tickets_per_user} tickets per user
          </Text>
        </View>
      ) : (
        <View></View>
      )}
      <Separator />
      <View className="py-4">
        <Text className="text-white text-xl font-bold">
          Total: ${getTotalPrice().toFixed(2)}
        </Text>
      </View>
      {user ? (
        <View>
          {getTotalTicketCount() === 0 ? (
            <TouchableOpacity
              className="bg-white opacity-50 py-3 rounded-full flex"
              disabled={getTotalTicketCount() == 0}
            >
              <Text className="text-black text-center font-bold">
                Add tickets above
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-white py-3 rounded-full flex"
              disabled={getTotalTicketCount() == 0}
              onPress={async () => {
                setIsLoading(true);
                const cart = await createPaymentIntent.mutateAsync({
                  event_id: event?.id!,
                  cart_info: Object.values(ticketQuantities).map((item) => ({
                    quantity: item.quantity,
                    section: {
                      ...item.section,
                    },
                  })),
                  price: getTotalPrice(),
                  user_id: user?.id,
                });

                router.push({
                  pathname: `/home/checkout/${event?.id}`,
                  params: {
                    cart: JSON.stringify(cart),
                    cartInfo: JSON.stringify(
                      Object.values(ticketQuantities).map((item) => ({
                        quantity: item.quantity,
                        section: {
                          ...item.section,
                        },
                      }))
                    ),
                    totalPrice: getTotalPrice(),
                    userId: user?.id,
                    event: JSON.stringify(event),
                  },
                });
              }}
            >
              <View className="flex flex-row items-center justify-center">
                {isLoading && <ActivityIndicator className="pr-2" />}
                <Text className="text-black text-center font-bold">
                  Proceed to Checkout
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Link href={`/profile`} asChild>
          <TouchableOpacity className="bg-white py-3 rounded-full flex">
            <Text className="text-black text-center font-bold">
              Sign in to Purchase
            </Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
};

export default TicketSection;
