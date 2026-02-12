import { Client } from '../client';
export interface AudioVisualize {
    start: (clientObject: Client, localStream: MediaStream, remoteStream: any) => void;
    stop: () => void;
}
/**
 * Initialize audio visualize.
 */
declare const audioVisualize: () => AudioVisualize;
export default audioVisualize;
