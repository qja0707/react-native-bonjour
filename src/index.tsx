import Bonjour from './NativeBonjour';

export function serviceResolve(serviceName: string) {
  return Bonjour.serviceResolve(serviceName);
}

export function serviceRegister(serviceName: string) {
  return Bonjour.serviceRegister(serviceName);
}

export function serviceUnregister() {
  return Bonjour.serviceUnregister();
}

export function serviceDiscovery() {
  return Bonjour.serviceDiscovery();
}

export const onDeviceDiscoveryServiceFound =
  Bonjour.onDeviceDiscoveryServiceFound;

export const onDeviceDiscoveryServiceLost =
  Bonjour.onDeviceDiscoveryServiceLost;
