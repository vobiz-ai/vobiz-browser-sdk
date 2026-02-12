import { Client } from "../client";
export declare class NoiseSuppression {
    private client;
    private noiseSuppresionEffect;
    noiseSupressionRunning: boolean;
    started: boolean;
    constructor(client: Client);
    private initNoiseSuppresionEffect;
    startNoiseSuppression: (mediaStream?: MediaStream | undefined) => Promise<MediaStream | null>;
    stopNoiseSuppresion: () => void;
    setLocalMediaStream: () => Promise<MediaStream | null>;
    updateProcessingStream: (stream: MediaStream) => Promise<MediaStream | null>;
    clearNoiseSupression: () => void;
    muteStream: () => void;
    unmuteStream: () => void;
    startNoiseSuppresionManual: () => Promise<void>;
    stopNoiseSuppressionManual: () => Promise<void>;
}
