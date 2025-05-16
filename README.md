# React Native Bonjour

A React Native library that provides Bonjour/Zeroconf/mDNS networking capabilities for iOS and Android, allowing service discovery and advertisement on local networks.

## Features

- Discover services on your local network
- Register your app as a service on the network
- Resolve service details (host, IP, port)
- Get notifications when services are found or lost
- Works on both iOS and Android

## Installation

```sh
npm install react-native-bonjour
```

## iOS Setup

Add the following to your `Info.plist`:

```xml
<key>NSBonjourServices</key>
<array>
    <string>_http._tcp.</string>
</array>
<key>NSLocalNetworkUsageDescription</key>
<string>Need local network access to find other devices</string>
```

## Android Setup

No additional setup required for Android.

## Usage

### Service Discovery

```javascript
import { 
  serviceDiscovery, 
  onDeviceDiscoveryServiceFound,
  onDeviceDiscoveryServiceLost
} from 'react-native-bonjour';

// Start discovering services
serviceDiscovery();

// Listen for services discovered
const discoveryListener = onDeviceDiscoveryServiceFound((service) => {
  console.log('Service found:', service);
  // service = { serviceName, serviceType, host, port }
});

// Listen for services lost
const lostListener = onDeviceDiscoveryServiceLost((service) => {
  console.log('Service lost:', service);
});

// Stop listening (e.g. in component unmount)
discoveryListener.remove();
lostListener.remove();
```

### Service Resolution

```javascript
import { serviceResolve } from 'react-native-bonjour';

// Resolve a specific service by name
serviceResolve('MyServiceName');
```

### Service Registration

```javascript
import { serviceRegister, serviceUnregister } from 'react-native-bonjour';

// Register a service with a name
serviceRegister('MyDeviceName');

// Unregister when needed
serviceUnregister();
```

## Lifecycle Management

The library automatically manages service registration based on app lifecycle:

- When the app goes to the background, services are unregistered
- When the app comes to the foreground, services are re-registered
- When the app is terminated, services are properly cleaned up

## Example

See the [example](./example) folder for a complete implementation.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)