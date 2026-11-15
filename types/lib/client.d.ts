/// <reference types="node" />
import { EventEmitter } from 'events';
import { WebSocketInterface, UA, RTCSession } from 'vobiz-jssip';
import { Logger, AvailableLogMethods, AvailableFlagValues, DtmfOptions } from './logger';
import { CallSession } from './managers/callSession';
import { StatsSocket } from './stats/ws';
import { OutputDevices, InputDevices, RingToneDevices } from './media/audioDevice';
import { NoiseSuppression } from './rnnoise/NoiseSuppression';
import { LoggerUtil } from './utils/loggerUtil';
export interface VobizObject {
    log: typeof Logger;
    sendEvents?: (obj: any, session: CallSession) => void;
    AppError?: (obj: any, log: any) => boolean;
    audioConstraints?: MediaTrackConstraints;
}
export interface ConfiguationOptions {
    codecs?: string[];
    enableTracking?: boolean;
    enableQualityTracking?: AvailableFlagValues;
    debug?: AvailableLogMethods;
    permOnClick?: boolean;
    enableIPV6?: boolean;
    audioConstraints?: MediaTrackConstraints;
    dscp?: boolean;
    appId?: null | string;
    appSecret?: null | string;
    registrationDomainSocket?: string[] | null;
    clientRegion?: null | string;
    preDetectOwa?: boolean;
    disableRtpTimeOut?: boolean;
    allowMultipleIncomingCalls?: boolean;
    closeProtection?: boolean;
    maxAverageBitrate?: number;
    useDefaultAudioDevice?: boolean;
    registrationRefreshTimer?: number;
    enableNoiseReduction?: boolean;
    useVobizStunServer?: boolean;
    dtmfOptions?: DtmfOptions;
    noiseReductionFilePath?: string;
}
export interface BrowserDetails {
    browser: string;
    version: number;
}
export interface ExtraHeaders {
    [key: string]: string;
}
export interface Storage {
    local_audio: any[];
    remote_audio: any[];
    mosLocalMeasures: any[];
    jitterLocalMeasures: number[];
    jitterRemoteMeasures: number[];
    packetLossRemoteMeasures: number[];
    packetLossLocalMeasures: number[];
    rtt: number[];
    mosRemoteMeasures: number[];
    audioCodec: null | string;
    startAnalysis: boolean;
    warning: {
        audioLocalMeasures: boolean;
        audioRemoteMeasures: boolean;
        mosLocalMeasures: boolean;
        mosRemoteMeasures: boolean;
        jitterLocalMeasures: boolean;
        jitterRemoteMeasures: boolean;
        packetLossRemoteMeasures: boolean;
        packetLossLocalMeasures: boolean;
        rtt: boolean;
        ice_connection: boolean;
    };
}
export interface ConnectionInfo {
    reason: string;
    state: string;
}
/**
 * Initializes the client.
 * @public
 */
export declare class Client extends EventEmitter {
    /**
     * Holds the browser details of the client
     * @private
     */
    browserDetails: BrowserDetails;
    /**
     * Set to true if you want to ask for mic permission just
     * before call connection. Otherwise it will be asked only on page load
     * @private
     */
    permOnClick: boolean;
    /**
     * Play the ringtone audio for incoming calls if this flag is set to true
     * Otherwise do not play audio.
     * @private
     */
    ringToneFlag: boolean;
    /**
     * Callback to perform login after previous connection is disconnected successfully
     * @private
     */
    loginCallback: any;
    /**
     * Play the ringtone audio for outgoing calls in ringing state if this flag is set to true
     * Otherwise do not play audio.
     * @private
     */
    ringToneBackFlag: boolean;
    /**
     * Play the connect tone audio for outgoing calls in sending state if this flag is set to true
     * Otherwise do not play audio.
     * @private
     */
    connectToneFlag: boolean;
    /**
     * Set to true if logged in. Otherwise set to false
     * @private
     */
    isLoggedIn: boolean;
    /**
     * Timer for reconnecting to the media connection if any network issue happen
     * @private
     */
    reconnectInterval: null | ReturnType<typeof setInterval>;
    /**
     * Controls the number of times media reconnection happens
     * @private
     */
    reconnectTryCount: number;
    /**
     * Holds the JSSIP user agent for the logged in user
     * @private
     */
    phone: UA | null;
    /**
     * Holds the incoming or outgoing call session details
     * @private
     */
    _currentSession: null | CallSession;
    /**
     * Holds the incoming or outgoing JSSIP RTCSession(WebRTC media session)
     * @private
     */
    callSession: null | RTCSession;
    /**
     * Unique identifier generated for a call by server
     * @private
     */
    callUUID: null | string;
    /**
     * Specifies whether the call direction is incoming or outgoing
     * @private
     */
    callDirection: null | string;
    /**
     * Holds the SpeechRecognition instance which listens for
     * speech when the user speaks on mute
     * @private
     */
    speechRecognition: any;
    /**
     * Holds the loggerUtil instance which keeps the
     * value of username and sipCallID to attached to each log
     * @private
     */
    loggerUtil: LoggerUtil;
    noiseSuppresion: NoiseSuppression;
    /**
     * Specifies whether the noise suppression should be enabled or not
     * @private
     */
    enableNoiseReduction: boolean | undefined;
    /**
     * Contains the identifier for previous incoming or outgoing call
     * @private
     */
    lastCallUUID: null | string;
    /**
     * Holds the call session of previous incoming or outgoing call
     * @private
     */
    _lastCallSession: null | CallSession;
    /**
     * Contains the ongoing incoming calls identifiers with their call session
     * @private
     */
    incomingInvites: Map<string, any>;
    /**
     * Contains the ongoing incoming calls identifiers with their start time
     * @private
     */
    incomingCallsInitiationTime: Map<string, any>;
    /**
     * Holds the call session of previous incoming call
     * @private
     */
    lastIncomingCall: null | CallSession;
    /**
     * Holds the callstats.io instance for sending the stats to callstats.io
     * @private
     */
    callStats: any;
    /**
     * Username given when logging in
     * @private
     */
    userName: null | string;
    /**
     * Password given when logging in
     * @private
     */
    password: null | string;
    /**
     * Access Token  given when logging in
     * @private
     */
    accessToken: null | string;
    /**
     * Access Token object given when logging in
     * @private
     */
    accessTokenObject: null | any;
    /**
     * boolean that tells which type of login method is called
     * @private
     */
    isAccessTokenGenerator: boolean | null;
    /**
     * boolean that tells which type of login method is called
     * @private
     */
    accessTokenGeneratorTimer: null | ReturnType<typeof setTimeout>;
    /**
     * boolean that tells if user logged in through access token
     * @private
     */
    isAccessToken: boolean;
    /**
     * access token expiry
     * @private
     */
    accessTokenExpiryInEpoch: number | null;
    /**
     * Access Token  Outgoing Grant
     * @private
     */
    isOutgoingGrant: boolean | null;
    /**
     * Access Token  Incoming Grant
     * @private
     */
    isIncomingGrant: boolean | null;
    /**
     * Access Token  abstract class that needs to be implemented
     * @private
     */
    accessTokenInterface: any;
    /**
     * Flag to monitor the feedback api that gets called after the token is expired
     * @private
     */
    deferFeedback: null | boolean;
    /**
     * Flag that tells if unregister is pending or not
     * @private
     */
    isUnregisterPending: null | boolean;
    /**
     * Options passed by the user while instantiating the client class
     * @private
     */
    options: ConfiguationOptions;
    /**
     * It is a unique identifer which is not null when callstats permission is present
     * @private
     */
    callstatskey: null | string;
    /**
     * Set to true if RTP stats needed to be sent for the call.Otherwise RTP stats are not sent
     * @private
     */
    rtp_enabled: boolean;
    /**
     * Set to true if user is using callstats.io
     * @private
     */
    statsioused: boolean;
    /**
     * Describes whether the call is in mute state or not
     * @private
     */
    isCallMuted: boolean;
    /**
     * Specifically used for SpeechRecognition
     * Describes whether the call is in mute state or not
     * @private
     */
    isMuteCalled: boolean;
    /**
     * Describes whether the call is on hold (placed by this client) or not
     * @private
     */
    isCallOnHold: boolean;
    /**
     * All audio related information
     * @public
     */
    audio: {
        /**
         * Return a promise with the list of available devices
         */
        availableDevices: (filter: string) => Promise<MediaDeviceInfo[]>;
        /**
         * Object with getter and setter functions for ringtone devices
         */
        ringtoneDevices: RingToneDevices;
        /**
         * Object with getter and setter functions for microphone devices
         */
        microphoneDevices: InputDevices;
        /**
         * Object with getter and setter functions for audio output devices
         */
        speakerDevices: OutputDevices;
        /**
         * Return a promise with the list of audio output devices
         */
        revealAudioDevices: (arg: string) => Promise<string | MediaStream>;
    };
    /**
     * Audio constraints object that will be passed to webRTC getUserMedia()
     * @private
     */
    audioConstraints: MediaTrackConstraints;
    /**
     * Holds the previous one way audio detection details
     * @private
     */
    owaLastDetect: {
        time: Date;
        isOneWay: boolean;
    };
    /**
     * Specifies the interval at which one way audio detection happens
     * @private
     */
    owaDetectTime: number;
    /**
     * explains whether call should be muted
     * @private
     */
    shouldMuteCall: boolean;
    /**
     * Holds the websocket instance created for sending stats
     * @private
     */
    statsSocket: null | StatsSocket;
    /**
     * Contains available audio devices.This is done for backward compatiblity
     * @private
     */
    audioDevDic: any;
    /**
     * It is a wrapper over ringback tone audio element.
     * It is used for playing and pausing ringtone audio for outgoing call
     * @private
     */
    ringBackToneView: null | HTMLAudioElement;
    /**
     * It is a wrapper over ring tone audio element.
     * It is used for playing and pausing ringtone audio for incoming call
     * @private
     */
    ringToneView: null | HTMLAudioElement;
    /**
     * Holds rtp stat information which will be used in capturing media metrics
     * @private
     */
    storage: Storage | null;
    /**
     * Holds the websocket instance created for SIP signalling purpose
     * @private
     */
    vobizSocket: WebSocketInterface;
    /**
     * Holds the connection state of the SDK
     * @private
     */
    connectionInfo: ConnectionInfo;
    /**
     * Responsible for playing audio stream of remote user during call
     * @private
     */
    remoteView: any;
    /**
     * It is a wrapper over connect tone audio element.
     * It is used for playing and pausing connect tone audio for outgoing call
     * @private
     */
    connectToneView: HTMLAudioElement;
    /**
     * Explains whether login method is called.
     * @private
     */
    isLoginCalled: boolean;
    /**
     * Explains whether logout method is called.
     * @private
     */
    isLogoutCalled: boolean;
    /**
     * Maintains a setInterval which checks for network change in idle state
     * @private
     */
    networkChangeInterval: null | ReturnType<typeof setInterval>;
    /**
    * Maintains a setInterval which checks for WS reconnection
    * @private
    */
    connectionRetryInterval: null | ReturnType<typeof setInterval>;
    /**
     * Calculate time taken for different stats
     * @private
     */
    timeTakenForStats: {
        [key: string]: {
            init: number;
            end?: number;
        };
    };
    /**
     * Holds network disconnected timestamp
     * @private
     */
    networkDisconnectedTimestamp: number | null;
    /**
     * Holds network reconnection timestamp
     * @private
     */
    networkReconnectionTimestamp: number | null;
    /**
     * Holds current network information
     * @private
     */
    currentNetworkInfo: {
        networkType: string;
        ip: string;
    };
    /**
     * Determines whether any audio device got toggled during current session
     * @private
     */
    deviceToggledInCurrentSession: boolean;
    /**
     * Determines whether any audio device got toggled during current session
     * @private
     */
    useDefaultAudioDevice: boolean;
    /**
     * Determines whether network got changed during current session
     * @private
     */
    networkChangeInCurrentSession: boolean;
    /**
     * Holds a boolean to get initial network info
     * @private
     */
    didFetchInitialNetworkInfo: boolean;
    /**
     * Holds the path of the noise reduction file(processor.js) provided by the application
     * @private
     */
    noiseReductionFilePath: string | undefined;
    /**
     * Determines which js framework sdk is running with
     * @private
     */
    jsFramework: string[];
    /**
     * Get current version of the SDK
     */
    version: string;
    /**
     * Register using user credentials.
     * @param {String} userName
     * @param {String} password
     */
    login: (username: string, password: string) => boolean;
    /**
     * Register using user access token.
     * @param {String} accessToken
     */
    loginWithAccessToken: (accessToken: string) => boolean;
    /**
     * Register using user access token.
     * @param {Any} accessTokenObject
     */
    loginWithAccessTokenGenerator: (accessTokenObject: any) => boolean;
    /**
     * get error string by error code
     * @param {number} errorCode
     */
    getErrorStringByErrorCodes: (errorCode: number) => string;
    /**
     * Unregister and clear stats timer, socket.
     */
    logout: () => boolean;
    /**
     * Start an outbound call.
     * @param {String} phoneNumber - It can be a sip endpoint/number
     * @param {Object} extraHeaders - (Optional) Custom headers which are passed in the INVITE.
     * They should start with 'X-VH'
     */
    call: (phoneNumber: string, extraHeaders: ExtraHeaders) => boolean;
    /**
     * Answer the incoming call.
     * @param {String} callUUID - (Optional) Provide latest CallUUID to answer the call
     * @param {String} actionOnOtherIncomingCalls -  (Optional) Specify action(reject, ignore,
     * letring)
     * for next incoming calls when already on call
     */
    answer: (callUUID: string, actionOnOtherIncomingCalls: string) => boolean;
    /**
     * Hangup the call(Outgoing/Incoming).
     */
    hangup: () => boolean;
    /**
     * Reject the Incoming call.
     * @param {String} callUUID - (Optional) Provide latest CallUUID to reject the call
     */
    reject: (callUUID: string) => boolean;
    /**
     * Ignore the Incoming call.
     * @param {String} callUUID - (Optional) Provide latest CallUUID to ignore the call
     */
    ignore: (callUUID: string) => boolean;
    /**
     * Send DTMF for call(Outgoing/Incoming).
     * @param {String} digit - Send the digits as dtmf 'digit'
     * ("1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#")
     */
    sendDtmf: (digit: string | number) => void;
    /**
     * Mute the call(Outgoing/Incoming).
     */
    mute: () => boolean;
    /**
     * Unmute the call(Outgoing/Incoming).
     */
    unmute: () => boolean;
    /**
     * Put the active call (Outgoing/Incoming) on hold.
     * Sends a SIP re-INVITE with a=sendonly, so neither side hears the other.
     * Emits 'onCallHold' once the far end accepts the re-INVITE.
     * @returns {Boolean} true if the hold request was sent
     */
    hold: () => boolean;
    /**
     * Resume a call that was put on hold with hold().
     * Emits 'onCallResume' once the far end accepts the re-INVITE.
     * @returns {Boolean} true if the resume request was sent
     */
    unhold: () => boolean;
    /**
     * Whether the active call is currently on hold (put on hold by this client).
     */
    isOnHold: () => boolean;
    /**
     * Configure the ringtone played when an incoming call starts ringing.
     * @param {Any} val - Can be media url or boolean value for enabling/disabling default ringtone
     */
    setRingTone: (val: string | boolean) => boolean;
    /**
     * Configure the ringtone played when an outgoing call starts ringing.
     * @param {Any} val - Can be media url or boolean value for enabling/disabling default ringtone
     */
    setRingToneBack: (val: string | boolean) => boolean;
    /**
     * Configure the audio played when an outgoing call is being connected.
     * @param {Boolean} val - Enable/Disable default connect tone
     */
    setConnectTone: (val: boolean) => boolean;
    /**
     * Starts the Noise Reduction.
     * @param {Boolean} val - true if noise reduction is started, else false
     */
    startNoiseReduction: () => Promise<boolean>;
    /**
   * stops the Noise Reduction.
   * @param {Boolean} val - true if noise reduction is stopped, else false
   */
    stopNoiseReduction: () => Promise<boolean>;
    /**
     * Configure the audio played when sending a DTMF.
     * @param {String} digit - Specify digit for which audio needs to be configured
     * @param {String} url - Media url for playing audio
     */
    setDtmfTone: (digit: string, url: string | boolean) => boolean;
    /**
     * Get the CallUUID if a call is active.
     * @returns Current CallUUID
     */
    getCallUUID: () => string | null;
    /**
   * Check if the client is in registered state.
   * @returns Current CallUUID
   */
    isRegistered: () => boolean | null;
    /**
  * Check if the client is in connecting state.
  * @returns Current CallUUID
  */
    isConnecting: () => boolean | null;
    /**
  * Check if the client is in connected state.
  * @returns Current CallUUID
  */
    isConnected: () => boolean | null;
    /**
     * Get the CallUUID of the latest answered call.
     */
    getLastCallUUID: () => string | null;
    /**
     * Get a list of incoming calls which are active.
     */
    getIncomingCalls: () => any[];
    /**
     * Update log level
     * @param {String} debug - log level
     */
    setDebug: (debug: AvailableLogMethods) => void;
    /**
     * Get RTCPeerConnection object
     */
    getPeerConnection: () => {
        status: string;
        pc: any;
    };
    /**
     * Get webRTC support, return true if webRTC is supported
     */
    webRTC: () => boolean;
    /**
     * Get supported browsers
     */
    supportedBrowsers: () => string;
    /**
     * Configure the audio played when sending a DTMF.
     * @param {String} callUUID - Specify CallUUID for which feedback needs to be sent
     * @param {String} starRating - Rate the call from 1 to 5
     * @param {Array<String>} issues - Provide suspected issues
     * @param {String} note - Send any remarks
     * @param {Boolean} sendConsoleLogs - Send browser logs to Vobiz
     */
    submitCallQualityFeedback: (callUUID: string, starRating: string, issues: string[], note: string, sendConsoleLogs: boolean) => Promise<string>;
    clearOnLogout(): void;
    /**
     * @constructor
     * @param options - (Optional) client configuration parameters
     * @private
     */
    constructor(options: ConfiguationOptions);
    private getUsernameFromToken;
    private validateToken;
    private parseJwtToken;
    private tokenLogin;
    setExpiryTimeInEpoch: (timeInEpoch: number) => void;
    getTokenExpiryTimeInEpoch: () => number | null;
    private _loginWithAccessTokenGenerator;
    private _initJWTParams;
    private _loginWithAccessToken;
    private _getErrorStringByErrorCodes;
    private _login;
    private _logout;
    private _call;
    private _answer;
    private _hangup;
    private _reject;
    private _ignore;
    private _sendDtmf;
    private _mute;
    private _unmute;
    private _toggleHold;
    private _hold;
    private _unhold;
    private _setRingTone;
    private _setRingToneBack;
    private _setConnectTone;
    private _setDtmfTone;
    private _getCallUUID;
    private _isRegistered;
    private _isConnecting;
    private _isConnected;
    private _startNoiseReduction;
    private _stopNoiseReduction;
    private _getLastCallUUID;
    private _getIncomingCalls;
    private _setDebug;
    private _getPeerConnection;
    private _submitCallQualityFeedback;
}
