import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
  multiply,
  serviceRegistrar,
  serviceDiscovery,
} from 'react-native-bonjour';

const result = multiply(3, 7);

export default function App() {
  useEffect(() => {
    console.log('useEffect');

    serviceRegistrar();

    setTimeout(() => {
      serviceDiscovery();
    }, 1000);

    console.log('useEffect end');
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
