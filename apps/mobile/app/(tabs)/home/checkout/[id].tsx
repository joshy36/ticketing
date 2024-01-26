import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { RouterOutputs, trpc } from '../../../../utils/trpc';
import Separator from '../../../components/Separator';
import CheckoutScreen from './CheckoutScreen';
import { useCallback, useEffect, useState } from 'react';

const Checkout = () => {
  const { event, cartInfo, totalPrice, userId, cart } = useLocalSearchParams<{
    event: string;
    cartInfo: string;
    totalPrice: string;
    userId: string;
    cart: string;
  }>();

  const startingSeconds = 600;
  const [seconds, setSeconds] = useState(startingSeconds);

  const deleteReservations = trpc.deleteReservationForTickets.useMutation({
    onSettled(error) {
      if (error) {
        console.error('Error deleting reservation:', error);
      } else {
      }
    },
  });

  const cartJson = JSON.parse(cartInfo!);
  const paymentInfo: RouterOutputs['createPaymentIntent'] = JSON.parse(cart!);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      return async () => {
        // Do something when the screen is unfocused
        deleteReservations.mutate({
          ticket_ids: paymentInfo?.ticketReservations.map(
            (ticket) => ticket.ticket_id!
          )!,
        });
      };
    }, [])
  );

  useEffect(() => {
    let intervalId: any;

    setSeconds(startingSeconds);
    intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          deleteReservations.mutate({
            ticket_ids: paymentInfo?.ticketReservations.map(
              (ticket) => ticket.ticket_id!
            )!,
          });
          router.back();

          clearInterval(intervalId); // Stop the interval
          return 0; // Set seconds to 0
        }
      });
    }, 1000);

    // Cleanup interval on component unmount or when countdown is stopped
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View className="flex-1 bg-black p-4">
      <View className="flex flex-row justify-between pb-4">
        <Text className="text-white font-bold text-3xl pb-4">Cart</Text>
        <View className="flex flex-col">
          <Text className="font-light text-muted-foreground">
            Time Remaining
          </Text>
          <Text className="flex justify-end text-lg font-semibold text-white">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')}
          </Text>
        </View>
      </View>
      {cartJson.map((section: any) => (
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
                  {`$` + section.section.price}
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
        cartInfo={cartJson}
        paymentIntent={paymentInfo.paymentIntent!}
        eventId={JSON.parse(event!).id!}
      />
    </View>
  );
};

export default Checkout;
