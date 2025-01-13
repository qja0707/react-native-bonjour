import Bonjour from './NativeBonjour';

export function multiply(a: number, b: number): number {
  return Bonjour.multiply(a, b);
}

export function serviceRegistrar() {
  return Bonjour.serviceRegistrar();
}

export function serviceDiscovery() {
  return Bonjour.serviceDiscovery();
}
