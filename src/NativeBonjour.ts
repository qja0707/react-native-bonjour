import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Bonjour 서비스 검색 및 등록을 위한 TurboModule 스펙
 */
export interface Spec extends TurboModule {
  // 예시 메서드 - 두 수를 곱합니다
  multiply(a: number, b: number): number;

  // Bonjour 서비스 검색 시작
  serviceDiscovery(): void;

  // Bonjour 서비스 검색 중지
  stopBonjourDiscovery(): void;

  // Bonjour 서비스 등록
  serviceRegistrar(serviceName: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Bonjour');
