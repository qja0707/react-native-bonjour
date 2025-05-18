import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export interface DeviceDiscoveryService {
  serviceName: string;
  serviceType: string;
  serviceDomain: string | null;
  servicePort: number | null;
}

/**
 * Bonjour 서비스의 정보를 가져옵니다.
 * @param serviceName 서비스 이름
 */
export function serviceResolve(serviceName: string): void;

/**
 * Bonjour 서비스를 등록합니다.
 * @param serviceName 등록할 서비스 이름
 */
export function serviceRegister(serviceName: string): void;

/**
 * 등록된 Bonjour 서비스를 해제합니다.
 */
export function serviceUnregister(): void;

/**
 * Bonjour 서비스 검색을 시작합니다.
 */
export function serviceDiscovery(): void;

/**
 * Bonjour 서비스가 발견되었을 때 호출되는 이벤트 이미터입니다.
 */
export const onDeviceDiscoveryServiceFound: EventEmitter<DeviceDiscoveryService>;

/**
 * Bonjour 서비스가 사라졌을 때 호출되는 이벤트 이미터입니다.
 */
export const onDeviceDiscoveryServiceLost: EventEmitter<DeviceDiscoveryService>;
