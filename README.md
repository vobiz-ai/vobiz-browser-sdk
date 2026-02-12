# Vobiz WebRTC SDK

## Introduction

The Vobiz Browser SDK enables browser-based voice calling through Vobiz's voice platform. It provides SIP registration, WebRTC-based calling, and audio device management.

## Installation

### NPM

```shell
npm install vobiz-webrtc-sdk --save 
```

### Usage

You can import Browser SDK using ES module or TypeScript syntax

```javascript
import Vobiz from 'vobiz-webrtc-sdk'
```

or using commonJS

```javascript
const Vobiz = require('vobiz-webrtc-sdk');
```

## TypeScript Support

This Browser SDK package includes TypeScript declarations. We support projects using TypeScript versions >= 4.0.3.

## Set Up Development Environment

### Install dependencies

```shell
npm install
```

### Build

You can create a minified or non-minified build:

```shell
npm run build
```

This command creates a minified, production-ready build at dist/vobizbrowsersdk.min.js.

```shell
npm run build:nominify
```

This command creates a non-minified version of the build file at dist/vobizbrowsersdk.js.

### Start the development server

```shell
npm start
```

This command builds the SDK file and attaches it to port 9000 — http://localhost:9000/vobizbrowsersdk.js. The project uses a [webpack-dev-server](https://github.com/webpack/webpack-dev-server) that helps with live reloading.

## Testing

### Unit tests

```shell
npm run test:unit
```

### Integration tests

Running integration tests requires some setup:

- Create a .env file in the root directory with endpoint credentials:

```shell
VOBIZ_ENDPOINT1_USERNAME=<Endpoint-1 Username>
VOBIZ_ENDPOINT1_PASSWORD=<Endpoint-1 Password>
VOBIZ_ENDPOINT2_USERNAME=<Endpoint-2 Username>
VOBIZ_ENDPOINT2_PASSWORD=<Endpoint-2 Password>
```

- After the setup, run integration tests:

```shell
npm run test:integration
```

## License

See [LICENSE](LICENSE)
