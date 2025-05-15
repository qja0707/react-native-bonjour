import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export interface DeviceDiscoveryService {
  serviceName: string;
  serviceType: string;
  serviceDomain: string | null;
  servicePort: number | null;
}

/**
 * Bonjour 서비스 검색 및 등록을 위한 TurboModule 스펙
 */
export interface Spec extends TurboModule {
  serviceResolve(serviceName: string): void;

  // Bonjour 서비스 검색 시작
  serviceDiscovery(): void;

  // Bonjour 서비스 검색 중지
  stopBonjourDiscovery(): void;

  // Bonjour 서비스 등록
  serviceRegister(serviceName: string): void;

  readonly onDeviceDiscoveryServiceFound: EventEmitter<DeviceDiscoveryService>;

  readonly onDeviceDiscoveryServiceLost: EventEmitter<DeviceDiscoveryService>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Bonjour');
