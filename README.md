# react-native-bonjour

bonjour network for react native

## Installation

```sh
npm install react-native-bonjour
```

## Usage


```js
import { multiply } from 'react-native-bonjour';

// ...

const result = multiply(3, 7);
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)


# info.plist

```
  <key>NSBonjourServices</key>
	<array>
		<string>_http._tcp.</string>
	</array>
	<key>NSLocalNetworkUsageDescription</key>
	<string>Need local network access to find other devices</string>
```