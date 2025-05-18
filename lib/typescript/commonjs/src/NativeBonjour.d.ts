import type { TurboModule } from 'react-native';
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
    serviceDiscovery(): void;
    stopBonjourDiscovery(): void;
    serviceRegister(serviceName: string): void;
    serviceUnregister(): void;
    readonly onDeviceDiscoveryServiceFound: EventEmitter<DeviceDiscoveryService>;
    readonly onDeviceDiscoveryServiceLost: EventEmitter<DeviceDiscoveryService>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeBonjour.d.ts.map