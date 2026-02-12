import { DtmfOptions } from '../logger';
import { Client, ConfiguationOptions } from '../client';
/**
 * Create HTML audio elements for webrtc remote stream.
 */
export declare const setupRemoteView: () => void;
/**
 * Create HTML audio elements for all the tones played during the call.
 * @param {Client} clientObject - client reference
 * @param {ConfiguationOptions} options - client configuration parameters
 */
export declare const setup: (clientObject: Client, options: ConfiguationOptions) => void;
/**
 * Parse the DTMFOptions and return the option, inband, outband or default
 * @param {String[]} dtmfOptions - list of dtmf options
 */
export declare const getDTMFOption: (dtmfOptions?: DtmfOptions | undefined) => string;
/**
 * Plays HTML audio elements based on element id.
 * @param {String} elementId - audio element id
 */
export declare const playAudio: (elementId: string, clientObj?: Client | undefined) => void;
/**
 * Stops HTML audio elements based on element id.
 * @param {String} elementId - audio element id
 */
export declare const stopAudio: (elementId: string) => void;
