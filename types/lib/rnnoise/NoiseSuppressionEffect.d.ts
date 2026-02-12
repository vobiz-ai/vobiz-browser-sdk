/**
 * Class Implementing the effect expected by a NoiseSupression.
 * Effect applies rnnoise denoising on a audio localTrack.
 */
export declare class NoiseSuppressionEffect {
    /**
     * Source that will be attached to the track affected by the effect.
     */
    private audioSource;
    /**
     * Destination that will contain denoised audio from the audio worklet.
     */
    private audioDestination;
    /**
     * `AudioWorkletProcessor` associated node.
     */
    noiseSuppressorNode?: AudioWorkletNode;
    /**
     * Audio track extracted from the original MediaStream to which the effect is applied.
     */
    private originalMediaTrack;
    /**
     * Noise suppressed audio track extracted from the media destination node.
     */
    private outputMediaTrack;
    private init;
    private audioContext;
    prepareAudioWorklet: (noiseReductionFilePath: string) => Promise<AudioWorkletNode | undefined>;
    /**
     * Effect interface called by source NoiseSuppresion.
     * Applies effect that uses a {@code NoiseSuppressor} service
     * initialized with {@code RnnoiseProcessor}
     * for denoising.
     *
     * @param {MediaStream} audioStream - Audio stream which will be mixed with _mixAudio.
     * @returns {MediaStream} - MediaStream containing both audio tracks mixed together.
     */
    startEffect(audioStream: MediaStream): Promise<MediaStream>;
    /**
     * Clean up resources acquired by noise suppressor and rnnoise processor.
     *
     * @returns {void}
     */
    stopEffect(): void;
    muteEffect(): void;
    unmuteEffect(): void;
    clearEffect(): void;
}
export declare function getBaseUrl(w?: typeof window): string;
