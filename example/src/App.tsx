import { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  serviceRegistrar,
  serviceDiscovery,
  onDeviceDiscoveryServiceFound,
  onDeviceDiscoveryServiceLost,
  serviceResolve,
} from 'react-native-bonjour';
import { useDeviceName } from 'react-native-device-info';
import type { DeviceDiscoveryService } from '../../src/NativeBonjour';

export default function App() {
  const { loading, result: deviceName } = useDeviceName();
  const [services, setServices] = useState<DeviceDiscoveryService[]>([]);

  const addService = useCallback((service: DeviceDiscoveryService) => {
    setServices((prev) => {
      if (prev.find((s) => s.serviceName === service.serviceName)) {
        return prev;
      }

      return [...prev, service];
    });
  }, []);

  const removeService = useCallback((service: DeviceDiscoveryService) => {
    setServices((prev) =>
      prev.filter((s) => s.serviceName !== service.serviceName)
    );
  }, []);

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

  useEffect(() => {
    const addServiceListener = onDeviceDiscoveryServiceFound((serviceInfo) => {
      console.log('RN: onDeviceDiscoveryServiceFound', serviceInfo);
      addService(serviceInfo);
    });

    const removeServiceListener = onDeviceDiscoveryServiceLost(
      (serviceInfo) => {
        console.log('RN: onDeviceDiscoveryServiceLost', serviceInfo);
        removeService(serviceInfo);
      }
    );

    return () => {
      addServiceListener.remove();
      removeServiceListener.remove();
    };
  }, [addService, removeService]);

  return (
    <View style={styles.container}>
      <Text>Device Name: {loading ? 'Loading...' : deviceName}</Text>

      <Text>Service Discovery</Text>

      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: 'black',
          width: '100%',
          height: 100,
        }}
      >
        <FlatList
          data={services}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                console.log(item);
                serviceResolve(item.serviceName);
              }}
            >
              <Text
                style={{
                  color: 'black',
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                }}
              >
                {item.serviceName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
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
