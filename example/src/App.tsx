import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
  multiply,
  serviceRegistrar,
  serviceDiscovery,
} from 'react-native-bonjour';
import { useDeviceName } from 'react-native-device-info';

const result = multiply(3, 7);

export default function App() {
  const { loading, result: deviceName } = useDeviceName();

  useEffect(() => {
    console.log('useEffect');

    // 디바이스 이름이 로드되면 서비스 등록
    if (!loading && deviceName) {
      console.log('Device name:', deviceName);
      serviceRegistrar(deviceName);
    }

    console.log('useEffect end');
  }, [loading, deviceName]);

  useEffect(() => {
    setTimeout(() => {
      serviceDiscovery();
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Text>Device Name: {loading ? 'Loading...' : deviceName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
