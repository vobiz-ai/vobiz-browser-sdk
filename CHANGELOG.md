# Changelog

## 1.0.6

- Fix: `hold()` / `unhold()` ended the call on incoming calls. 1.0.5 sent hold as a SIP UPDATE; the media server answers an UPDATE with `a=setup:actpass`, the browser rejects that answer, and the call was torn down ("Hold Failed") without `onCallTerminated`. Hold and resume now use a re-INVITE (fixed in the bundled vobiz-jssip 1.0.2). Verified live: three hold/resume cycles on one call, audio stops and resumes each time, `onCallHold` / `onCallResume` fire.

## 1.0.5

- Added `client.hold()`, `client.unhold()` and `client.isOnHold()` for answered calls. The `onCallHold` and `onCallResume` events fire once the far end accepts the request.
- Hold and resume are sent as SIP UPDATE, so the request goes out immediately on a connected call.
- Bundles vobiz-jssip 1.0.2 (re-INVITE fix: a normal re-INVITE no longer resets the WebSocket).
- `repository` and `bugs` now point at github.com/vobiz-ai/vobiz-browser-sdk.
- Added CI, security scans and npm trusted publishing from GitHub releases.
