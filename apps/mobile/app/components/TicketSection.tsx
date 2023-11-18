import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import Separator from './Separator';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { User } from '@supabase/supabase-js';
import { Section } from '../(tabs)/home/[id]';
import { RouterOutputs } from 'api';

const TicketSection = ({
  event,
  sections,
  user,
  sectionPrices,
}: {
  event: RouterOutputs['getEventById'];
  sections: Section[];
  user: User | null;
  sectionPrices:
    | {
        section_id: string;
        section_name: string | null;
        price: number;
      }[]
    | undefined;
}) => {
  const [ticketQuantities, setTicketQuantities] = useState<{
    [id: string]: {
      quantity: number;
      section: Section;
    };
  }>({});

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
      const sectionPrice = sectionPrices?.find(
        (sectionPrice) => sectionPrice.section_id === id
      );

      if (sectionPrice) {
        totalPrice += quantity.quantity * sectionPrice.price;
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
            <Text className="text-gray-400 text">
              {`$` +
                sectionPrices?.find(
                  (sectionPrice) => sectionPrice.section_id === section.id
                )?.price}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => {
                handleRemoveTicket(section);
              }}
              disabled={ticketQuantities[section.id!]?.quantity <= 0}
            >
              <Ionicons name="remove-circle-outline" size={50} color="white" />
            </TouchableOpacity>
            <Text className="text-white px-2">
              {ticketQuantities[section.id!]?.quantity || 0}
            </Text>
            <TouchableOpacity
              onPress={() => {
                handleAddTicket(section);
              }}
              disabled={getTotalTicketCount() >= event?.max_tickets_per_user!}
            >
              <Ionicons name="add-circle-outline" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {getTotalTicketCount() >= event?.max_tickets_per_user! ? (
        <View>
          <Text className="text-white text-center">Max 2 tickets per user</Text>
        </View>
      ) : (
        <View></View>
      )}
      <Separator />
      <View className="pb-4">
        <Text className="text-white text-xl">Total: ${getTotalPrice()}</Text>
      </View>
      {user ? (
        <Link
          href={{
            pathname: `/home/checkout/${event?.id}`,
            params: {
              ticketQuantities: JSON.stringify(Object.values(ticketQuantities)),
              totalPrice: getTotalPrice(),
            },
          }}
          asChild
        >
          <TouchableOpacity
            className="bg-white py-3 rounded-xl flex"
            disabled={getTotalTicketCount() == 0}
          >
            <Text className="text-black text-center font-bold">
              {getTotalTicketCount() === 0
                ? 'Add tickets to cart'
                : 'Proceed to Checkout'}
            </Text>
          </TouchableOpacity>
        </Link>
      ) : (
        <Link href={`/profile`} asChild>
          <TouchableOpacity className="bg-white py-3 rounded-xl flex">
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
