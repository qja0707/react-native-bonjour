import Bonjour from './NativeBonjour';

export function serviceResolve(serviceName: string) {
  return Bonjour.serviceResolve(serviceName);
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
