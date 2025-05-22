import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  onDeviceDiscoveryServiceFound,
  onDeviceDiscoveryServiceLost,
  serviceDiscovery,
  serviceRegister,
  serviceResolve,
  serviceUnregister,
} from 'react-native-bonjour';
import { useDeviceName } from 'react-native-device-info';
import type { DeviceDiscoveryService } from '../../src/NativeBonjour';
import TabView from './TabView';
import Device from '../asset/mobile.png';
import httpServer from './services/httpServer';
import TcpSocket from 'react-native-tcp-socket';
export default function App() {
  const isServiceRegistered = useRef(false);

  const { loading, result: deviceName } = useDeviceName();
  const [services, setServices] = useState<DeviceDiscoveryService[]>([]);

  const [selectedService, setSelectedService] =
    useState<DeviceDiscoveryService | null>(null);

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
      httpServer.start();

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

      if (!!serviceInfo.host && !!serviceInfo.port) {
        setSelectedService(serviceInfo);
      }

      addService(serviceInfo);
    });

    const removeServiceListener = onDeviceDiscoveryServiceLost(
      (serviceInfo) => {
        console.log('RN: onDeviceDiscoveryServiceLost', serviceInfo);
        removeService(serviceInfo);

        // 연결된 호스트가 사라지면 소켓 연결 해제
        if (serviceInfo.host === selectedService?.host) {
          setSelectedService(null);
        }
      }
    );

    return () => {
      addServiceListener.remove();
      removeServiceListener.remove();

      httpServer.stop();
    };
  }, [addService, removeService, selectedService?.host]);

  const handleConnect = (device: DeviceDiscoveryService) => () => {
    serviceResolve(device.serviceName);
  };

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

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => {
              console.log('서버 연결 테스트 요청');
              httpServer.testConnection();
            }}
          >
            <Text style={styles.testButtonText}>서버 테스트</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.networksContainer}>
          {services.map((device) => (
            <TouchableOpacity
              key={device.serviceName}
              style={styles.otherDeviceContainer}
              onPress={handleConnect(device)}
            >
              <Text>{device.serviceName}</Text>
              {selectedService?.serviceName === device.serviceName && (
                <Text style={styles.connectedText}>연결됨</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filesContainer}>
        <TabView
          onPress={(thingToBeTransmitted) => {
            console.log('RN: thingToBeTransmitted', thingToBeTransmitted);

            if (
              selectedService &&
              selectedService.host &&
              selectedService.port
            ) {
              const { host, port } = selectedService;
              console.log('RN: host', host);
              console.log('RN: port', port);

              try {
                // 소켓 연결 전 유효성 검사 추가
                if (!host || !port) {
                  console.error('유효하지 않은 호스트 또는 포트:', {
                    host,
                    port,
                  });
                  return;
                }

                console.log('소켓 연결 시도 중...', { host, port });

                const socket = TcpSocket.createConnection(
                  {
                    host,
                    port,
                  },
                  () => {
                    console.log(`연결 성공: ${host}:${port}`);

                    const httpRequest = `${thingToBeTransmitted}`;

                    console.log('보내는 데이터:', httpRequest);
                    socket.write(httpRequest);
                  }
                );

                // 소켓 이벤트 핸들러 추가
                socket.on('connect', () => {
                  console.log('소켓 연결됨');
                });

                socket.on('data', (data) => {
                  console.log('서버 응답:', data.toString());
                });

                socket.on('error', (error) => {
                  console.error('소켓 에러:', error);
                });

                socket.on('close', () => {
                  console.log('소켓 연결 종료');
                });
              } catch (e) {
                console.error('소켓 생성 예외 발생:', e);
              }
            } else {
              console.error(
                '선택된 서비스 없음 또는 유효하지 않은 호스트/포트'
              );
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    flexDirection: 'row',
  },
  myDeviceImage: {
    height: '30%',
    aspectRatio: 1,
  },
  connectedText: {
    marginLeft: 10,
    fontSize: 12,
    color: 'green',
  },
  testButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
