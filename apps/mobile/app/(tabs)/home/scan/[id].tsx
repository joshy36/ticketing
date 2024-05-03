import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { trpc } from '../../../../utils/trpc';
import { useLocalSearchParams } from 'expo-router';

export default function App() {
  const { id } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const scanTicket = trpc.scanTicket.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error('Error scanning ticket:', error);
        if (error.message == 'Unauthorized scanner!') {
          alert(`User not authorized to scan tickets for this event!`);
        } else {
          // alert(`Ticket has already been scanned!`);
          alert(`Error: ${error}`);
        }
      } else {
        console.log('ticket scanned');
        alert(`Ticket scanned successfully!`);
      }
    },
  });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      // @ts-ignore
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    scanTicket.mutate({
      event_id: id! as string,
      qr_code: data,
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View className="flex-1 items-center bg-black">
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          className="flex-1"
        />
      </View>
      {scanned ? (
        <TouchableOpacity
          className="bg-white py-3 rounded-full flex w-80"
          onPress={() => setScanned(false)}
        >
          <Text className="text-black text-center font-bold">
            Tap to scan another ticket
          </Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-white py-2 font-bold">Ready</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    width: '90%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
    marginTop: 40,
  },
});
