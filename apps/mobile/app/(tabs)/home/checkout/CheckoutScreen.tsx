import { useStripe } from '@stripe/stripe-react-native';
import { Alert, TouchableOpacity, View, Text } from 'react-native';
import { router } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useState } from 'react';

export default function CheckoutScreen({
  cartInfo,
  paymentIntent,
  eventId,
}: {
  cartInfo: {
    quantity: number;
    section: {
      id: string;
      name: string | null;
    };
  }[];
  paymentIntent: string;
  eventId: string;
}) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
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

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === 'Canceled') {
      } else {
        Alert.alert(`Error code: ${error.code}`, error.message);
      }
    } else {
      // Alert.alert('Success', 'Your order is confirmed!');
      // confetti();
      // wait 1 sec before redirecting
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace(`/tickets/${eventId}`);
    }
  };

  // const [shoot, setShoot] = useState(false);

  // const confetti = () => {
  //   //To fire the cannon again
  //   // setShoot(false);
  //   // setTimeout(() => {
  //   //   setShoot(true);
  //   // }, 500);
  //   setShoot(true);
  // };

  return (
    <View>
      {/* {shoot ? (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fadeOut={true}
          fallSpeed={5000}
        />
      ) : null} */}
      <TouchableOpacity
        className="bg-white py-3 rounded-full flex "
        onPress={openPaymentSheet}
      >
        <Text className="text-black text-center font-bold">Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}
