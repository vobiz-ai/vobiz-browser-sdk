# Changelog

## 1.0.5

- Added `client.hold()`, `client.unhold()` and `client.isOnHold()` for answered calls. The `onCallHold` and `onCallResume` events fire once the far end accepts the request.
- Hold and resume are sent as SIP UPDATE, so the request goes out immediately on a connected call.
- Bundles vobiz-jssip 1.0.2 (re-INVITE fix: a normal re-INVITE no longer resets the WebSocket).
- `repository` and `bugs` now point at github.com/vobiz-ai/vobiz-browser-sdk.
- Added CI, security scans and npm trusted publishing from GitHub releases.
