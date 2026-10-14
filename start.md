# Quick Start Guide: Vobiz WebRTC SDK

Follow these steps to build the SDK, run tests, and verify voice calling.

---

## 🏗️ Build Commands

Depending on your environment, use the appropriate build command:

| Command | Description | Output File |
| :--- | :--- | :--- |
| `npm run build` | **Standard Build**: Production optimized (minified). Cleans types. | `dist/vobiz-webrtc-sdk.min.js` |
| `npm run build:nominify` | **Debug Build**: Non-minified version for easier debugging. | `dist/vobiz-webrtc-sdk.js` |
| `npm run build:npm` | **NPM Build**: Specifically for publishing to registry. | `dist/vobiz-webrtc-sdk.js` |
| `npm run build:ts` | **Typescript Only**: Only transpiles TS to JS. | `types/` |
| `npx http-server .` | **Serve**: Start local server for browser testing. | N/A |

---

## 🧪 Test Commands

The SDK uses `Jest` for unit tests and `Karma` for integration tests.

```bash
# Run ALL tests (Unit + Integration)
npm run test

# Run only Unit Tests
npm run test:unit

# Run only Integration Tests (Requires Chrome)
npm run test:integration
```

---

## 🚀 How to Test in Browser (Sample App)

The repository includes a **Test Console** to verify SIP registration and calls.

1.  **Start a local server**:
    ```bash
    npx http-server .
    ```
2.  **Open in Browser**:  
    Navigate to: [http://127.0.0.1:8080/sample/index.html](http://127.0.0.1:8080/sample/index.html)

3.  **Authentication Test**:
    - **Username**: `testing04949394196792859672850`
    - **Password**: `testing`
    - Click **"Connect & Register"**. Verify status turns **Green**.

---

## ✅ Testing Checklist

Validate these features before going to production:

### 1. Connection & Signaling
- [ ] **WSS Handshake**: Connects to `wss://registrar.vobiz.ai:5063` without errors.
- [ ] **SIP Registration**: Status turns "Registered" within 2-3 seconds.
- [ ] **Challenge Response**: Verify Digest Authentication (MD5) is accepted by Kamailio.
- [ ] **Keep-Alives**: Verify the connection stays open during idle time.

### 2. Basic Calling
- [ ] **Outgoing Call**: Can dial a number or SIP-URI.
- [ ] **Incoming Call**: Modal appears when an external number calls the endpoint.
- [ ] **Answer/Hangup**: Call state changes correctly in the UI.

### 3. Media & Audio
- [ ] **Mic Permission**: Browser prompts for microphone access.
- [ ] **Level Indicator**: Verify the audio activity bar moves when speaking.
- [ ] **Echo Test**: Dial `sip:echo@registrar.vobiz.ai` to verify loopback audio quality.

### 4. Branding & Logs
- [ ] **Logging**: Open DevTools Console. Ensure logs are tagged with `VobizSDK`.
- [ ] **Clean Branding**: Logs, error strings and SIP headers mention only Vobiz; no upstream vendor names appear anywhere.
