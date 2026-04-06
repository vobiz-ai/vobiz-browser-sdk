/* eslint func-names: ["error", "as-needed"] */
export type AvailableCodecs = 'OPUS' | 'G722' | 'PCMA' | 'PCMU' | 'ISAC' | 'CN';

/**
 * Get payload type number for a given codec name from the SDP.
 * Handles both \r\n and \n line endings.
 * Returns the numeric payload type string, or false if not found.
 */
const getPayloadValue = function (
  codec: string,
  sdp: string,
): string | false {
  // Match: a=rtpmap:<pt> CODEC/ — anchored by slash after codec name
  const reg = new RegExp(`a=rtpmap:(\\d+) ${codec}/`, 'i');
  const match = sdp.match(reg);
  if (match && match[1]) {
    return match[1];
  }
  return false;
};

/**
 * Rewrite the m=audio payload type list in-place.
 * Handles both \r\n and \n line endings.
 */
const rewriteMLine = (sdp: string, newPtList: string): string => sdp.replace(
  /(m=audio\s+\d+\s+\S+\s+)([\d ]+)/i,
  (_: string, prefix: string) => `${prefix}${newPtList}`,
);

/**
 * Extract all payload type numbers listed on the m=audio line.
 */
const getMLinePts = (sdp: string): string[] => {
  const match = sdp.match(/m=audio\s+\d+\s+\S+\s+([\d ]+)/i);
  if (!match || !match[1]) return [];
  return match[1].trim().split(/\s+/).filter((p) => p !== '');
};

/**
 * Remove all a=rtpmap, a=fmtp, a=rtcp-fb lines for payload types
 * that are NOT listed on the m=audio line.
 *
 * This is the safe, exhaustive approach: after rewriting the m= line
 * we simply remove every attribute whose payload type is no longer
 * referenced — regardless of codec name. This handles telephone-event,
 * ISAC, CN, and any other codec Vobiz may send.
 */
const removeOrphanedAttributes = (sdp: string): string => {
  const activePts = getMLinePts(sdp);
  let result = sdp;

  // Find all payload types that have a=rtpmap lines
  const rtpmapReg = /a=rtpmap:(\d+) /gi;
  let rtpmapMatch;
  const allRtpmapPts: string[] = [];
  // eslint-disable-next-line no-cond-assign
  while ((rtpmapMatch = rtpmapReg.exec(sdp)) !== null) {
    allRtpmapPts.push(rtpmapMatch[1]);
  }

  // Remove attributes for any payload type not on the m= line
  allRtpmapPts.forEach((pt) => {
    if (!activePts.includes(pt)) {
      // Remove a=rtpmap
      result = result.replace(
        new RegExp(`\\r?\\na=rtpmap:${pt} [^\\r\\n]*`, 'ig'),
        '',
      );
      // Remove a=fmtp
      result = result.replace(
        new RegExp(`\\r?\\na=fmtp:${pt}[^\\r\\n]*`, 'ig'),
        '',
      );
      // Remove a=rtcp-fb
      result = result.replace(
        new RegExp(`\\r?\\na=rtcp-fb:${pt} [^\\r\\n]*`, 'ig'),
        '',
      );
    }
  });

  return result;
};

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
const codecPref = function (prefCodecs: AvailableCodecs[], sdp: string): string {
  if (!prefCodecs || prefCodecs.length === 0) return sdp;

  // Build the ordered list of payload types for preferred codecs
  // that actually exist in the remote SDP
  const preferredPts: string[] = [];
  prefCodecs.forEach((codec) => {
    const pt = getPayloadValue(codec, sdp);
    if (pt) preferredPts.push(pt);
  });

  // If none of the preferred codecs appear in the SDP, return unchanged
  // (returning an empty m= line would produce invalid SDP Chrome would reject)
  if (preferredPts.length === 0) return sdp;

  // Step 1: Rewrite the m=audio codec list to only the preferred payload types
  let result = rewriteMLine(sdp, preferredPts.join(' '));

  // Step 2: Remove ALL a=rtpmap/a=fmtp/a=rtcp-fb for payload types
  // no longer on the m= line — this catches telephone-event and anything else
  result = removeOrphanedAttributes(result);

  return result;
};

export default codecPref;
