"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onDeviceDiscoveryServiceLost = exports.onDeviceDiscoveryServiceFound = void 0;
exports.serviceDiscovery = serviceDiscovery;
exports.serviceRegister = serviceRegister;
exports.serviceResolve = serviceResolve;
exports.serviceUnregister = serviceUnregister;
var _NativeBonjour = _interopRequireDefault(require("./NativeBonjour.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function serviceResolve(serviceName) {
  return _NativeBonjour.default.serviceResolve(serviceName);
}
function serviceRegister(serviceName) {
  return _NativeBonjour.default.serviceRegister(serviceName);
}
function serviceUnregister() {
  return _NativeBonjour.default.serviceUnregister();
}
function serviceDiscovery() {
  return _NativeBonjour.default.serviceDiscovery();
}
const onDeviceDiscoveryServiceFound = exports.onDeviceDiscoveryServiceFound = _NativeBonjour.default.onDeviceDiscoveryServiceFound;
const onDeviceDiscoveryServiceLost = exports.onDeviceDiscoveryServiceLost = _NativeBonjour.default.onDeviceDiscoveryServiceLost;
//# sourceMappingURL=index.js.map