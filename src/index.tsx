import Bonjour from './NativeBonjour';

export function multiply(a: number, b: number): number {
  return Bonjour.multiply(a, b);
}

export function serviceRegistrar(serviceName: string) {
  return Bonjour.serviceRegistrar(serviceName);
}

export function serviceDiscovery() {
  return Bonjour.serviceDiscovery();
}

export const onDeviceDiscoveryServiceFound =
  Bonjour.onDeviceDiscoveryServiceFound;

export const onDeviceDiscoveryServiceLost =
  Bonjour.onDeviceDiscoveryServiceLost;
