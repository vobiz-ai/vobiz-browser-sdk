import { CallSession, SignallingInfo, MediaConnectionInformation } from '../managers/callSession';
import { ConfiguationOptions } from '../client';
import { FeedbackObject } from '../utils/feedback';
export interface AnsweredEvent {
    msg: string;
    info: string;
    clientName: any;
    userAgent: string;
    clientVersionMajor: any;
    clientVersionMinor: any;
    clientVersionPatch: any;
    sdkName: string;
    sdkVersionMajor: number;
    sdkVersionMinor: number;
    sdkVersionPatch: number;
    devicePlatform: string;
    deviceOs: string;
    setupOptions: ConfiguationOptions;
    audioDeviceInfo?: DeviceAudioInfo;
    noiseReduction: NoiseReduction;
}
export interface DeviceAudioInfo {
    noOfAudioInput: number;
    noOfAudioOutput: number;
    audioInputLables: string;
    audioOutputLables: string;
    audioInputGroupIds: string;
    audioOutputGroupIds: string;
    audioInputIdSet: string;
    audioOutputIdSet: string;
    activeInputAudioDevice: string;
    activeOutputAudioDevice: string;
    activeInputDeviceGroupId: string;
    activeOutputDeviceGroupId: string;
}
export interface RingingEvent {
    msg: string;
    userAgent: string;
    clientVersionMajor: string;
    clientVersionMinor: string;
    clientVersionPatch: string;
    sdkName: string;
    sdkVersionMajor: number;
    sdkVersionMinor: number;
    sdkVersionPatch: number;
    clientName: string;
    devicePlatform: string;
    deviceOs: string;
    setupOptions: ConfiguationOptions;
    signalling?: any;
    mediaConnection?: any;
    audioDeviceInfo?: DeviceAudioInfo;
    isAudioDeviceToggled?: boolean;
    isNetworkChanged?: boolean;
    jsFramework: string[];
    isAudioDeviceMismatch?: boolean;
    noiseReduction: NoiseReduction;
}
export interface SummaryEvent {
    msg: string;
    userAgent: string;
    clientVersionMajor: string;
    clientVersionMinor: string;
    clientVersionPatch: string;
    sdkName: string;
    sdkVersionMajor: number;
    sdkVersionMinor: number;
    sdkVersionPatch: number;
    clientName: string;
    devicePlatform: string;
    deviceOs: string;
    setupOptions: ConfiguationOptions;
    signalling?: any;
    mediaConnection?: any;
    audioDeviceInfo?: DeviceAudioInfo;
    isAudioDeviceToggled?: boolean;
    isNetworkChanged?: boolean;
    jsFramework: string[];
    isAudioDeviceMismatch?: boolean;
    noiseReduction: NoiseReduction;
}
export interface NoiseReduction {
    enabled: boolean;
    noiseSuprressionStarted: boolean;
}
/**
 * Add call related information to call answered/summary stat.
 * @param {CallSession} callSession - call information
 * @param {Any} statMsg - call stats (Answered/RTP/Summary/Feedback/Failure Events)
 * @param {String} callstatskey - UUID which is not null when callstats permission is present
 * @param {String} userName
 * @returns Stat message with call information
 */
export declare const addCallInfo: (callSession: CallSession, statMsg: any, callstatskey: string, userName: string) => object;
/**
 * Send events to Vobiz stats.
 * @param {Any} statMsg - call stats (Answered/RTP/Summary/Feedback/Failure Events)
 * @param {CallSession} session - call session information
 */
export declare const sendEvents: (statMsg: any, session: CallSession) => void;
/**
 * Report errors to callstats.io.
 * @param {Any} err - Error(call failures) stat
 * @param {Any} log - option to log error in browser console
 */
export declare const AppError: (err: any, log: any) => boolean;
/**
 * Send call answered event to Vobiz stats.
 * @param {DeviceAudioInfo} deviceInfo - input and output audio device information
 * @param {Boolean} isIncoming - check if it is a incoming call
 */
export declare const sendCallAnsweredEvent: (deviceInfo: DeviceAudioInfo, isIncoming: boolean) => void;
/**
 * Send call summary event to Vobiz stats.
 * @param {DeviceAudioInfo} deviceInfo - input and output audio device information
 * @param {SignallingInfo} signallingInfo - holds timestamp for each state of call
 * @param {MediaConnectionInfo} mediaConnectionInfo - media connection information
 * @param {CallSession} session - call session information
 */
export declare const sendCallSummaryEvent: (deviceInfo: DeviceAudioInfo, signallingInfo: SignallingInfo, mediaConnectionInfo: MediaConnectionInformation, session: CallSession) => void;
export declare const sendCallRingingEvent: (deviceInfo: DeviceAudioInfo, signallingInfo: SignallingInfo, mediaConnectionInfo: MediaConnectionInformation, session: CallSession) => void;
/**
   * Send user feedback to Vobiz stats.
   * @param {CallSession} callSession - call information
   * @param {FeedbackObject} feedback - user feedback(contains score, issues, remarks)
   */
export declare const sendFeedbackEvent: (callSession: CallSession, feedback: FeedbackObject) => void;
/**
   * Get error name based on code.
   * @param {Number} status_code
   * @return SIP error message
   */
export declare const signallingEvent: (status_code: number) => string;
/**
   * Triggered when ice connection failure happens.
   * @param {CallSession} callSession - call session information
   * @param {Error} error
   */
export declare const onIceFailure: (callSession: CallSession, error: Error) => void;
/**
   * Triggered when media connection failure happens.
   * @param {CallSession} callSession - call session information
   * @param {Error} error
   */
export declare const onMediaFailure: (callSession: CallSession, error: Error) => void;
/**
   * Triggered when sdp creation failure happens.
   * @param {CallSession} callSession - call session information
   * @param {Error} error
   */
export declare const onSDPfailure: (callSession: CallSession, error: Error) => void;
/**
   * Triggered when audio is muted or unmuted.
   * @param {CallSession} callSession - call session information
   * @param {String} action
   */
export declare const onToggleMute: (callSession: CallSession, action: string) => void;
