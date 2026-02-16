# Quick Start Guide: Vobiz WebRTC SDK

Follow these steps to build the SDK and test voice calling.

## 1. Install & Build
First, install dependencies and build the SDK distribution files.

```bash
# Install dependencies
npm install

# Build the SDK (creates dist/vobiz-webrtc-sdk.js)
npm run build
```

## 2. Run Sample App
Start a local web server to run the included test console.

```bash
# Start server in the current directory
npx http-server .
```

Once running, open your browser to:  
👉 **[http://127.0.0.1:8080/sample/index.html](http://127.0.0.1:8080/sample/index.html)**  
*(Port might be 8081 if 8080 is taken. Check terminal output)*

## 3. Test Registration
Use the **Test Console** to verify the connection to `registrar.vobiz.ai`.

**Credentials:**
*   **Username:** `test242843159083241034285`
*   **Password:** `d00f5d5217896fb7fd601412cb890830`

**Steps:**
1.  Enter the Username and Password above.
2.  Click **"Connect & Register"**.
3.  Look for the **"Registered"** status indicator (Green dot).
4.  Check the logs at the bottom for `✅ Successfully registered with Vobiz!`.

## 4. Test Calling (Echo)
To verify audio, you can dial a test echo number (if configured) or another active Vobiz endpoint.

1.  Enter Destination: `sip:echo@registrar.vobiz.ai` (or valid endpoint).
2.  Click **"Call"**.
3.  Allow Microphone permission.
4.  Speak and verify you hear audio back.
