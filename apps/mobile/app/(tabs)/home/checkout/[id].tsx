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
      <Text className="text-white text-2xl">Cart</Text>
      <Separator />
      {cart!.map((section: any) => (
        <View key={section.section.id}>
          {section.quantity == 0 ? (
            <View></View>
          ) : (
            <View>
              <Text className="text-white text-xl">{section.section.name}</Text>
              <Text className="text-gray-400 text">
                {`$` +
                  sectionPrices?.find(
                    (sectionPrice) =>
                      sectionPrice.section_name === section.section.name
                  )?.price}
              </Text>
              <Text className="text-white text-xl">{`Quantity: ${section.quantity}`}</Text>
              <Separator />
            </View>
          )}
        </View>
      ))}
      <Text className="text-white text-xl pb-4">Total: ${totalPrice}</Text>
      <CheckoutScreen
        event_id={id! as string}
        cart_info={cart}
        price={Number(totalPrice)}
      />
    </View>
  );
};

export default Checkout;
