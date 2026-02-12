import { SessionProgressEvent, SessionFailedEvent, RTCSession } from 'vobiz-jssip';
import { CallSession } from './callSession';
/**
 * Prepare summary event when browser tab is about to close
 * @returns Summary event
 */
export declare const setErrorCollector: () => void;
/**
 * Check for closeProtection option and show a
 * dialog prompt when closing a page which has an active connection
 */
export declare const addCloseProtectionListeners: () => void;
/**
 * Find and replace all MDNS candidates with "192.168.0.1"
 * @param {String} sdp - rtcsession description
 * @returns SDP with mdns ips
 */
export declare const replaceMdnsIceCandidates: (sdp: string) => string;
/**
 * Get current time
 */
export declare const getCurrentTime: () => number;
/**
 * Initialise callstats storage.
 */
export declare const callStart: () => void;
/**
 * Notify network drops.
 * @param {RTCPeerConnectionState} iceState - ice connection state
 */
export declare const iceConnectionCheck: (iceState: RTCPeerConnectionState) => void;
/**
 * Set DSCP class to Expedited Forwarding as soon as the call is answered
 */
export declare const setEncodingParameters: () => void;
export declare const getUTCTImeString: () => string;
/**
 * Handle ice connection change.
 * @param {RTCPeerConnection} connection - media connection
 * @param {CallSession} callSession - call session information
 */
export declare const onIceConnectionChange: (connection: RTCPeerConnection, callSession: CallSession) => Promise<void>;
/**
 * Extract reason from SIP messages.
 * @param {string | object} reasonMessage - SIP message
 */
export declare const extractReasonInfo: (reasonMessage: any) => {
    protocol: any;
    cause: number;
    text: any;
};
export declare const extractReason: (evt: SessionFailedEvent) => {
    protocol: any;
    cause: number;
    text: any;
} | {
    protocol: string;
    cause: any;
    text: string;
};
/**
 * Start collecting vobiz rtp stats.
 * @param {CallSession} callSession - call session information
 */
export declare const statsCollector: (callSession: CallSession) => void;
/**
 * Clear all flags and session information.
 * @param {CallSession} session - call session information
 */
export declare const hangupClearance: (session: CallSession) => void;
/**
 * Add mid attribute to SDP. Fix for https://bugzilla.mozilla.org/show_bug.cgi?id=1495569
 * @param {SessionProgressEvent} evt - rtcsession progress information
 */
export declare const addMidAttribute: (evt: SessionProgressEvent) => void;
/**
 * Add a new fabric message to callstats.io
 * @param {CallSession} callSession - call session information
 * @param {String} userId - source username
 * @param {String} callUUID - active callUUID
 */
export declare const addCallstatsIOFabric: (callSession: CallSession, userId: string, callUUID: string) => void;
/**
 * Send error to stats wahen media error occurs.
 * @param {SessionFailedEvent} evt - rtcsession failed information
 * @param {CallSession} callSession - call session information
 */
export declare const handleMediaError: (evt: SessionFailedEvent, callSession: CallSession) => void;
/**
 * Check if rtc session is established.
 * @param {RTCSession} session - rtcsession information
 */
export declare const isSessionConfirmed: (session: RTCSession) => boolean;
/**
 * Check if client is using a mobile browser or not
 * @returns true if client is mobile browser
 */
export declare const mobileBrowserCheck: () => boolean;
export declare const logCandidatePairs: (callSession: CallSession | null) => void;
export declare const removeSpaces: (inputString: string) => string;
