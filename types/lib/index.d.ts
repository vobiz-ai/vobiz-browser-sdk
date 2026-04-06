import { Client, ConfiguationOptions, ExtraHeaders } from './client';
import { CallSession, CallInfo, CallSessionOptions, SignallingInfo, MediaConnectionInformation } from './managers/callSession';
/** All event names emitted by the Vobiz SDK client */
export declare const VobizEvents: {
    readonly ON_LOGIN: "onLogin";
    readonly ON_LOGIN_FAILED: "onLoginFailed";
    readonly ON_LOGOUT: "onLogout";
    readonly ON_INCOMING_CALL: "onIncomingCall";
    readonly ON_INCOMING_CALL_CANCELED: "onIncomingCallCanceled";
    readonly ON_INCOMING_CALL_IGNORED: "onIncomingCallIgnored";
    readonly ON_CALL_ANSWERED: "onCallAnswered";
    readonly ON_CALL_TERMINATED: "onCallTerminated";
    readonly ON_CALL_FAILED: "onCallFailed";
    readonly ON_MEDIA_CONNECTED: "onMediaConnected";
    readonly ON_MEDIA_PERMISSION: "onMediaPermission";
    readonly ON_CALL_CONNECTED: "onCallConnected";
    readonly REMOTE_AUDIO_STATUS: "remoteAudioStatus";
    readonly ON_DTMF_RECEIVED: "onDtmfReceived";
    readonly ON_PERMISSION_DENIED: "onPermissionDenied";
};
declare class Vobiz {
    client: Client;
    constructor(options: ConfiguationOptions);
}
export default Vobiz;
export type { Client, ConfiguationOptions, ExtraHeaders, CallSession, CallInfo, CallSessionOptions, SignallingInfo, MediaConnectionInformation, };
