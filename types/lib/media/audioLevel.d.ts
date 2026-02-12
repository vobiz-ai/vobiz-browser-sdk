/**
 * Analyse the audio level for a stream(local/remote).
 */
export declare class AudioLevel {
    /**
     * Audio volume in decibles
     * @private
     */
    volumeLevel: number;
    /**
     * Audio frequency segments
     * @private
     */
    fftBins: null | Float32Array;
    /**
     * Analyze the audio levels from a media stream
     * @private
     */
    analyser: null | AnalyserNode;
    /**
     * It is used for checking if audio level analysis stopped
     * @private
     */
    stopped: boolean;
    /**
     * Holds media obtained through microphone or peer connection
     * @private
     */
    sourceNode: MediaStreamAudioSourceNode;
    /**
     * Get audio level in decibles.
     */
    getAudioLevel: () => number;
    /**
     * Stop analysing audio levels.
     */
    stop: () => void;
    /**
     * @constructor
     * @param {MediaStream} stream - instance of MediaStream
     * @private
     */
    constructor(stream: MediaStream);
}
