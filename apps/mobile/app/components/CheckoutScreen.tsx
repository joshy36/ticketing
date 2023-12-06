import { useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { Alert, TouchableOpacity, View, Text } from 'react-native';
import { trpc } from '../../utils/trpc';
import { Section } from '../(tabs)/home/[id]';

export default function CheckoutScreen({
  price,
  event_id,
  cart_info,
}: {
  price: number;
  event_id: string;
  cart_info: {
    quantity: number;
    section: Section;
  }[];
}) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentIntent, setPaymentIntent] = useState('');

  const getPaymentSheetParams = trpc.createPaymentIntent.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error fetching payment intent ticket:', error);
        alert(`Error!`);
      } else {
        setPaymentIntent(data?.paymentIntent!);
      }
    },
  });

  const initializePaymentSheet = async () => {
    console.log('price', price);
    const filteredCartInfo = cart_info.map((item) => ({
      quantity: item.quantity,
      section: {
        id: item.section.id,
        name: item.section.name,
      },
    }));
    console.log('filteredCartInfo', filteredCartInfo);
    const test = await getPaymentSheetParams.mutateAsync({
      event_id: event_id,
      cart_info: filteredCartInfo,
      price: price,
    });
    console.log('resolution: ', test);

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Ticketing',
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      // allowsDelayedPaymentMethods: true,
      // need to figure this out
      returnURL: 'your-app://stripe-redirect',
    });
  };

  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === 'Canceled') {
      } else {
        Alert.alert(`Error code: ${error.code}`, error.message);
      }
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <View>
      <TouchableOpacity
        className="bg-white py-3 rounded-full flex "
        onPress={openPaymentSheet}
      >
        <Text className="text-black text-center font-bold">Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}
