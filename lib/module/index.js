"use strict";

import Bonjour from "./NativeBonjour.js";
export function serviceResolve(serviceName) {
  return Bonjour.serviceResolve(serviceName);
}
export function serviceRegister(serviceName) {
  return Bonjour.serviceRegister(serviceName);
}
export function serviceUnregister() {
  return Bonjour.serviceUnregister();
}
export function serviceDiscovery() {
  return Bonjour.serviceDiscovery();
}
export const onDeviceDiscoveryServiceFound = Bonjour.onDeviceDiscoveryServiceFound;
export const onDeviceDiscoveryServiceLost = Bonjour.onDeviceDiscoveryServiceLost;
//# sourceMappingURL=index.js.map