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
            (ticket) => ticket.ticket_id!,
          )!,
        });
      };
    }, []),
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
              (ticket) => ticket.ticket_id!,
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
    <View className='flex-1 bg-black p-4'>
      <View className='flex flex-row justify-between pb-4'>
        <Text className='pb-4 text-3xl font-bold text-white'>Cart</Text>
        <View className='flex flex-col'>
          <Text className='font-light text-muted-foreground'>
            Time Remaining
          </Text>
          <Text className='flex justify-end text-lg font-semibold text-white'>
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
            <View className='flex flex-row justify-between pb-4'>
              <View className='flex flex-row items-center gap-2'>
                <View className='rounded-full bg-zinc-800 px-4 py-1'>
                  <Text className='font-bold text-white'>
                    {section.quantity}
                  </Text>
                </View>
                <Text className='text-xl text-white'>
                  {section.section.name}
                </Text>
              </View>
              <View>
                <Text className='text-xl text-white'>
                  {`$` + section.section.price}
                </Text>
              </View>
            </View>
          )}
        </View>
      ))}
      <Separator />
      <View className='flex flex-row justify-between'>
        <Text className='py-4 text-xl font-bold text-white'>Total:</Text>
        <Text className='py-4 text-xl font-bold text-white'>${totalPrice}</Text>
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
