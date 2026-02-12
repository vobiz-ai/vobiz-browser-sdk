import { Client, Storage } from '../client';
import { AudioLevel } from '../media/audioLevel';
export interface LocalCandidate {
    id?: string;
    address?: string;
    port?: string;
    relatedAddress?: string;
    relatedPort?: string;
    candidateType?: string;
    usernameFragment?: string;
}
declare type LocalCandidateMap = {
    [timestamp: string]: LocalCandidate;
};
export interface RemoteCandidate {
    id?: string;
    address?: string;
    port?: string;
    candidateType?: string;
    usernameFragment?: string;
}
export interface CandidatePair {
    availableOutgoingBitrate?: string;
    consentRequestsSent?: number;
    id?: string;
    lastPacketReceivedTimestamp?: string;
    lastPacketSentTimestamp?: string;
    localCandidateId?: string;
    nominated?: string;
    packetsDiscardedOnSend?: string;
    packetsReceived?: string;
    packetsSent?: string;
    remoteCandidateId?: string;
    requestsReceived?: number;
    requestsSent?: number;
    responsesReceived?: number;
    responsesSent?: number;
    state?: string;
    transportId?: string;
    writable?: boolean;
}
export interface Transport {
    id?: string;
    dtlsRole?: string;
    dtlsState?: string;
    iceRole?: string;
    iceState?: string;
    packetsReceived?: string;
    packetsSent?: string;
    selectedCandidatePairChanges?: number;
    selectedCandidatePairId?: string;
}
export interface OutboundRTP {
    bytesSent?: number;
    packetsSent?: number;
    retransmittedBytesSent?: number;
    retransmittedPacketsSent?: number;
    transportId?: string;
}
export interface RemoteInboundRTP {
    fractionLost?: number;
    packetsLost?: number;
    roundTripTime?: string;
    roundTripTimeMeasurements?: number;
    totalRoundTripTime?: string;
    transportId?: string;
}
export interface InboundRTP {
    bytesReceived?: number;
    jitterBufferDelay?: string;
    jitterBufferEmittedCount?: number;
    jitterBufferMinimumDelay?: string;
    jitterBufferTargetDelay?: string;
    packetsDiscarded?: number;
    packetsLost?: number;
    packetsReceived?: number;
    totalSamplesDuration?: string;
    totalSamplesReceived?: string;
    transportId?: string;
}
export interface RemoteOutboundRTP {
    bytesSent?: number;
    packetsSent?: number;
    reportsSent?: number;
    totalRoundTripTime?: string;
    transportId?: string;
}
export interface StatsDump {
    msg: string;
    callUUID: string;
    xcallUUID: string;
    source: string;
    timeStamp: number;
    version: string;
    changedCandidatedInfo: LocalCandidateMap;
    localCandidate: LocalCandidate;
    remoteCandidate: RemoteCandidate;
    transport: Transport;
    candidatePair: CandidatePair;
    outboundRTP: OutboundRTP;
    remoteInboundRTP: RemoteInboundRTP;
    inboundRTP: InboundRTP;
    remoteOutboundRTP: RemoteOutboundRTP;
}
export interface StatsLocalStream {
    ssrc?: number;
    packetsLost?: number;
    bytesReceived?: number;
    packetsReceived?: number;
    jitter?: number | null;
    audioLevel?: number;
    rtt?: number | null;
    mos?: number | null;
    fractionLoss?: number;
    audioInputLevel?: number;
    audioOutputLevel?: number;
    bytesSent?: number;
    packetsSent?: number;
    googJitterReceived?: number;
    googRtt?: number;
    googEchoCancellationReturnLossEnhancement?: number;
    googEchoCancellationReturnLoss?: number;
}
export interface StatsRemoteStream {
    ssrc?: number;
    packetsLost?: number;
    bytesReceived?: number;
    packetsReceived?: number;
    jitter?: number | null;
    audioLevel?: number;
    fractionLoss?: number;
    audioInputLevel?: number;
    audioOutputLevel?: number;
    googJitterReceived?: number;
    googRtt?: number;
    jitterBufferDelay?: number;
    googJitterBufferMs?: number;
    packetsDiscarded?: number;
}
export interface StatsObject {
    msg: string;
    callstats_key: string;
    local: StatsLocalStream;
    remote: StatsRemoteStream;
    codec: string;
    xcallUUID: string;
    callUUID: string;
    corelationId: string;
    userName: string;
    timeStamp: number;
    domain: string;
    source: string;
    version: string;
    networkType: string;
    networkEffectiveType: string;
    networkDownlinkSpeed: number;
    statsIOUsed: boolean;
    pdd?: number;
    mediaSetupTime?: number;
}
interface RtpStatsStream {
    codec: string;
    local: StatsLocalStream;
    remote: StatsRemoteStream;
    networkType: string;
    gotNetworkType?: boolean;
}
/**
 * Get RTP stats.
 * @param {RtpStatsStream} stream - holds local and remote stat details
 */
export declare const handleWebRTCStats: (stream: RtpStatsStream) => void;
/**
 * Initialize and create timers, media streams for RTP stats.
 */
export declare class GetRTPStats {
    /**
     * Client class reference
     */
    clientScope: Client;
    /**
     * Represents a WebRTC connection between caller and callee
     * @private
     */
    pc: RTCPeerConnection;
    rtpsender: RTCStatsReport;
    rtpreceiver: RTCStatsReport;
    localCandidateInfo: LocalCandidateMap;
    /**
     * Unique identifier generated for a call by server
     * @private
     */
    xcallUUID: string;
    /**
     * Identifier generated by JSSIP when a new RTCSession is created for the call
     * @private
     */
    callUUID: string;
    /**
     * Identifier generated by JSSIP when a new RTCSession is created for the call
     * @private
     */
    corelationId: string;
    /**
     * Username given when logging in
     * @private
     */
    userName: string;
    /**
     * Holds rtp stat information which will be used in capturing media metrics
     * @private
     */
    storage: Storage;
    /**
     * It is a unique identifer which is not null when callstats permission is present
     * @private
     */
    callstatskey: string;
    /**
     * Set to true if user is using callstats.io
     * @private
     */
    statsioused: boolean;
    /**
     * Set to true if rtp stats are collected for the first time
     * @private
     */
    baseStatsCollected: boolean;
    /**
     * Holds the packet information of the previous stat
     * @private
     */
    packets: {
        prePacketsReceived?: any;
        prePacketsSent?: any;
        preRemotePacketsLoss?: any;
        preLocalPacketsLoss?: any;
    };
    /**
     * Used for capturing local media stream
     * @private
     */
    senderMediaStream: MediaStream | null;
    /**
     * Used for capturing remote media stream
     * @private
     */
    receiverMediaStream: MediaStream;
    /**
     * Holds the audio level instance of the sender media stream
     * @private
     */
    localAudioLevelHelper: AudioLevel;
    /**
     * Holds the audio level instance of the receiver media stream
     * @private
     */
    remoteAudioLevelHelper: AudioLevel;
    /**
     * Describes the audio level for the local stream
     * @private
     */
    audioInputLevel: null | number;
    /**
     * Describes the audio level for the remote stream
     * @private
     */
    audioOutputLevel: null | number;
    /**
     * Input audio samples collected count
     * @private
     */
    audioInputCount: number;
    /**
     * Output audio samples collected count
     * @private
     */
    audioOutputCount: number;
    /**
     * Timer for collecting audio levels
     * @private
     */
    audioTimer: ReturnType<typeof setInterval>;
    /**
     * Timer for collecting RTP stats
     * @private
     */
    statsTimer: ReturnType<typeof setInterval>;
    /**
     * Holds rtp stats and call info
     * @private
     */
    collected: StatsObject;
    /**
     * @constructor
     * @param {Object} that - client reference
     * @private
     */
    constructor(client: Client);
    sendCallStatsDump: (stream: StatsDump) => Promise<void>;
    /**
     * Stop analysing audio levels for local and remote streams.
     */
    stop: () => Promise<void>;
}
export {};
