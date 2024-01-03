import { useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { trpc } from '../../../../utils/trpc';
import Separator from '../../../components/Separator';
import CheckoutScreen from '../../../components/CheckoutScreen';
import { Section } from '../[id]';

const Checkout = () => {
  const { id, ticketQuantities, totalPrice } = useLocalSearchParams();
  const cart: {
    quantity: number;
    section: Section;
  }[] = JSON.parse(ticketQuantities! as string);

  const { data: event, isLoading: eventLoading } = trpc.getEventById.useQuery({
    id: id! as string,
  });

  const { data: sectionPrices, isLoading: sectionPricesLoading } =
    trpc.getSectionPriceByEvent.useQuery(
      { event_id: event?.id! },
      { enabled: !!event }
    );

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white font-bold text-3xl pb-4">Cart</Text>
      {cart!.map((section: any) => (
        <View key={section.section.id}>
          {section.quantity == 0 ? (
            <View></View>
          ) : (
            <View className="flex flex-row justify-between pb-4">
              <View className="flex flex-row gap-2 items-center">
                <View className="bg-zinc-800 py-1 px-4 rounded-full">
                  <Text className="text-white font-bold">
                    {section.quantity}
                  </Text>
                </View>
                <Text className="text-white text-xl">
                  {section.section.name}
                </Text>
              </View>
              <View>
                <Text className="text-white text-xl">
                  {`$` +
                    sectionPrices?.find(
                      (sectionPrice) =>
                        sectionPrice.section_name === section.section.name
                    )?.price}
                </Text>
              </View>
            </View>
          )}
        </View>
      ))}
      <Separator />
      <View className="flex flex-row justify-between">
        <Text className="py-4 font-bold text-xl text-white">Total:</Text>
        <Text className="py-4 font-bold text-xl text-white">${totalPrice}</Text>
      </View>
      <Separator />

      <CheckoutScreen
        event_id={id! as string}
        cart_info={cart}
        price={Number(totalPrice)}
      />
    </View>
  );
};

export default Checkout;
