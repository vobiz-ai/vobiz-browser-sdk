import { StatsObject } from './rtpStats';
/**
 * Send media metrics during call
 * @param {String} group - specifies the category(audio or network) for which this metric belongs
 * @param {String} level - severity level. Currently, it is only 'warning'
 * @param {String} type - warning type
 * @param {String} value - average value of the stat
 * @param {Boolean} active - if true warning is still present, else warning is not present
 * @param {String} desc - description for the warning
 * @param {String} stream - type of RTP stats
 */
export declare const emitMetrics: (group: string, level: string, type: string, value: number, active: boolean, desc: string, stream: string) => void;
/**
 * Start analysing media metrics during call.
 * @param {StatsObject} streams - RTP stats(local and remote)
 * @param {Boolean} isLocalMuted - mute status for local audio
 */
export declare const processStreams: (streams: StatsObject, isLocalMuted: boolean) => void;
