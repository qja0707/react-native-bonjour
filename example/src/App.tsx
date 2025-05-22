import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  onDeviceDiscoveryServiceFound,
  onDeviceDiscoveryServiceLost,
  serviceDiscovery,
  serviceRegister,
  serviceUnregister,
} from 'react-native-bonjour';
import { useDeviceName } from 'react-native-device-info';
import type { DeviceDiscoveryService } from '../../src/NativeBonjour';
import TabView from './TabView';
import Device from '../asset/mobile.png';

export default function App() {
  const isServiceRegistered = useRef(false);

  const { loading, result: deviceName } = useDeviceName();
  const [services, setServices] = useState<DeviceDiscoveryService[]>([]);

  const addService = useCallback((service: DeviceDiscoveryService) => {
    setServices((prev) => {
      const enrolledServiceIndex = prev.findIndex(
        (s) => s.serviceName === service.serviceName
      );
      if (enrolledServiceIndex !== -1) {
        prev[enrolledServiceIndex] = service;
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

    if (isServiceRegistered.current) {
      return;
    }

    // 디바이스 이름이 로드되면 서비스 등록
    if (!loading && deviceName) {
      serviceRegister(deviceName);

      isServiceRegistered.current = true;
    }

    console.log('useEffect end');

    return () => {
      serviceUnregister();
    };
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
    <SafeAreaView style={styles.container}>
      <View style={styles.deviceContainer}>
        <View style={styles.myDeviceContainer}>
          <Image
            source={Device}
            style={styles.myDeviceImage}
            resizeMode="contain"
          />

          <Text>{deviceName}</Text>
        </View>

        <ScrollView style={styles.networksContainer}>
          {services.map((device) => (
            <View key={device.serviceName} style={styles.otherDeviceContainer}>
              <Text>{device.serviceName}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filesContainer}>
        <TabView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // 연한 회색으로 변경
  },
  deviceContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  myDeviceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networksContainer: {
    flex: 2,
  },
  filesContainer: {
    flex: 2,
    backgroundColor: 'white',
  },
  otherDeviceContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myDeviceImage: {
    height: '30%',
    aspectRatio: 1,
  },
});
