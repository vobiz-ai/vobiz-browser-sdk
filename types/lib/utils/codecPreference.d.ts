export declare type AvailableCodecs = 'OPUS' | 'G722' | 'PCMA' | 'PCMU' | 'ISAC' | 'CN';
/**
 * Reorder codecs on the m=audio line to match prefCodecs order,
 * and strip ALL orphaned codec attributes from the SDP.
 *
 * Strategy:
 * 1. Find payload types for each preferred codec that exists in the SDP
 * 2. Rewrite the m=audio line to contain ONLY those payload types
 * 3. Remove every a=rtpmap/a=fmtp/a=rtcp-fb whose PT is no longer on m=
 *
 * This approach handles any codec name (including telephone-event, CN, etc.)
 * without needing a hardcoded allow/deny list.
 */
declare const codecPref: (prefCodecs: AvailableCodecs[], sdp: string) => string;
export default codecPref;
