# Vobiz WebRTC SDK

[![npm](https://img.shields.io/npm/v/vobiz-webrtc-sdk)](https://www.npmjs.com/package/vobiz-webrtc-sdk)
[![CI](https://github.com/vobiz-ai/vobiz-browser-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/vobiz-ai/vobiz-browser-sdk/actions/workflows/ci.yml)

Browser calling for [Vobiz](https://www.vobiz.ai). The SDK registers a browser tab with Vobiz over a secure WebSocket, places and receives calls, and gives you in-call controls: mute, DTMF, and hold/resume.

| | |
|---|---|
| **Documentation** | [vobiz.ai/docs/integrations/webrtc-sdk](https://www.vobiz.ai/docs/integrations/webrtc-sdk) |
| **Starter kit** | [vobiz-ai/Vobiz-RTC-demo](https://github.com/vobiz-ai/Vobiz-RTC-demo): Node.js answer-URL backend and a browser softphone |
| **Try it without code** | [WebRTC Playground](https://rtc-demo.vobiz.ai) ([guide](https://www.vobiz.ai/docs/integrations/webrtc-application-setup)) |
| **SIP library** | [vobiz-jssip](https://github.com/vobiz-ai/vobiz-jssip), bundled into this package |
| **Changelog** | [CHANGELOG.md](CHANGELOG.md) |

## Install

```bash
npm install vobiz-webrtc-sdk
```

```javascript
import Vobiz from 'vobiz-webrtc-sdk';
```

Add `<audio id="remoteAudio" autoplay></audio>` to your page; the SDK plays the other party's audio through it. TypeScript declarations are included.

## Quick start

```javascript
const client = new Vobiz({ debug: 'ERROR' }).client;

client.on('onLogin', () => client.call('+919876543210', {}));
client.on('onIncomingCall', (callerId, headers, callInfo) => client.answer(callInfo.callUUID));
client.on('onCallHold', () => console.log('on hold'));
client.on('onCallResume', () => console.log('resumed'));

client.login('ENDPOINT_USERNAME', 'ENDPOINT_PASSWORD'); // or client.loginWithAccessToken(token)
```

Log in with a [SIP endpoint](https://www.vobiz.ai/docs/platform/voice/endpoints) username and password, or with an access token minted by your backend. Never put your account Auth Token in the browser.

See the [documentation](https://www.vobiz.ai/docs/integrations/webrtc-sdk) for outbound and incoming calls, in-call controls, hold/resume behaviour, and the full event list.

## Upgrading from 1.0.5

Upgrade to 1.0.6 or later. In 1.0.5, `hold()` dropped incoming calls, and on outbound calls audio kept flowing while the call showed as held. From 1.0.6, hold and resume work on every call and the microphone is muted while the call is on hold. No code changes are needed.

## Development

```bash
npm ci --legacy-peer-deps
npm run build:webpack && npm run build:npm   # dist/vobiz-webrtc-sdk.min.js, dist/vobiz-webrtc-sdk.js
npm run test:unit
```

Releases are published to npm from GitHub: merge to `main`, then create a GitHub release tagged `vX.Y.Z` that matches `package.json`. The `Publish to npm` workflow builds, tests and publishes with npm trusted publishing.

## License

Apache-2.0. See [LICENSE](LICENSE).
