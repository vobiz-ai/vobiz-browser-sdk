export declare type AvailableCodecs = 'OPUS' | 'G722' | 'PCMA' | 'PCMU' | 'ISAC' | 'CN';
/**
 * Update incoming call information.
 * @param {Array<AvailableCodecs>} prefCodecs - preferred codec list
 * @param {String} sdp - rtcsession description
 */
declare const codecPref: (prefCodecs: AvailableCodecs[], sdp: string) => string;
export default codecPref;
