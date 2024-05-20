import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { trpc } from '@/utils/trpc';
import { Entypo } from '@expo/vector-icons';
import Separator from './components/Separator';

export default function Modal() {
  const { paymentIntent } = useLocalSearchParams<{
    paymentIntent: string;
  }>();

  function extractBeforeSecret(str: any) {
    const match = str.match(/^(.*?)_secret_/);
    return match ? match[1] : str;
  }
  console.log('intent: ', extractBeforeSecret(paymentIntent));

  const paymentIntentFull = trpc.getStripePaymentIntent.useQuery({
    paymentIntent: extractBeforeSecret(paymentIntent),
  });

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  return (
    <View className="flex-1 justify-center bg-black pt-4">
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && <Link href="../">Dismiss</Link>}
      {paymentIntentFull.isLoading ||
      paymentIntentFull.data?.status === 'processing' ? (
        <View className="flex flex-col items-center justify-center">
          <Text className="text-4xl font-bold text-white">
            Confirming purchase...
          </Text>
          <Text className="pb-8 text-muted-foreground">
            This should only take a few seconds.
          </Text>
        </View>
      ) : (
        <View className="px-8">
          {paymentIntentFull.data?.status === 'succeeded' ? (
            <View className="flex flex-col items-center justify-center bg-zinc-950 p-8 rounded-xl border border-zinc-800">
              <View className="flex flex-row gap-4">
                <Text className="pb-8 text-3xl font-bold text-white">
                  Order Confirmed!
                </Text>
                {/* <CheckCircle2 className="h-8 w-8 text-green-600" /> */}
              </View>

              {JSON.parse(paymentIntentFull.data?.metadata.cart_info!).map(
                (section: any) => (
                  <View key={section.section.id}>
                    {section.quantity == 0 ? (
                      <View></View>
                    ) : (
                      <View className="flex flex-row justify-between w-full">
                        <View className="flex items-start">
                          <View className="flex flex-row h-6 items-center sm:h-7">
                            <View className="bg-zinc-800 py-1 px-4 rounded-full">
                              <Text className="text-white font-bold">
                                {section.quantity}
                              </Text>
                            </View>
                            <Text className="pl-2 text-white">
                              {section.section.name}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text className="ml-2 text-lg font-light text-white">
                            {`$` + section.section.price}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )
              )}
              <Separator />
              <View className="flex flex-row justify-between w-full">
                <View className="pt-2 text-lg font-semibold text-white">
                  <Text className="text-white font-bold text-xl">Total:</Text>
                </View>
                <View className="pt-2 text-lg font-semibold text-white">
                  <Text className="text-white font-bold text-xl">
                    ${(paymentIntentFull.data?.amount! / 100).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="flex justify-center">
                <TouchableOpacity
                  className="mt-8 px-4 py-2 rounded-full border border-white flex flex-row items-center justify-center"
                  onPress={() => router.replace('/tickets')}
                >
                  <Text className="text-white">View Tickets</Text>
                  <Entypo name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="flex flex-col items-center justify-center">
              <View className="flex flex-row gap-4">
                <Text className="pb-8 text-4xl font-bold text-white">
                  Order Failed! Please try again.
                </Text>
                {/* <XCircle className="h-8 w-8 text-red-600" /> */}
              </View>
              <Link href={`/event/list`}>
                <TouchableOpacity className="px-8">
                  {/* <ChevronLeftIcon /> */}
                  <Text className="text-white">Back to events</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
