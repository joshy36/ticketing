// import React, { useState } from 'react';
// import { SearchBar } from '@rneui/themed';
// import { View, Text } from 'react-native';

// const Search = () => {
//   const [search, setSearch] = useState('');

//   const updateSearch = (search: string) => {
//     setSearch(search);
//   };

//   return (
//     <View className="flex-1 items-center justify-center bg-black">
//       <Text>Search Page</Text>
//       <SearchBar
//         className="bg-black text-green-600"
//         placeholder="Type Here..."
//         onChangeText={updateSearch}
//         value={search}
//       />
//     </View>
//   );
// };

// export default Search;

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (isMounted) {
        setHasPermission(status === 'granted');
      }
    })();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Scan a ticket.</Text>
      {scanned ? (
        <Text style={styles.paragraph}>Scanned</Text>
      ) : (
        <Text style={styles.paragraph}>Not scanned</Text>
      )}
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
      <Pressable style={styles.button} onPress={() => setScanned(false)}>
        <Text style={styles.buttonText}>Tap to scan again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
    color: 'white',
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
