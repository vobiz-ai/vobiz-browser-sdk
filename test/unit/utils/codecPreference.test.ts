import CheckCodecPreference from '../../../lib/utils/codecPreference';

// Real-world SDP with \r\n line endings (as received from a SIP server)
const REAL_WORLD_SDP = [
  'v=0',
  'o=- 0 0 IN IP4 127.0.0.1',
  's=-',
  't=0 0',
  'm=audio 9 UDP/TLS/RTP/SAVPF 111 103 9 0 8 13 110 126',
  'c=IN IP4 0.0.0.0',
  'a=rtcp:9 IN IP4 0.0.0.0',
  'a=ice-ufrag:abc',
  'a=ice-pwd:xyz',
  'a=fingerprint:sha-256 AA:BB',
  'a=setup:actpass',
  'a=mid:audio',
  'a=sendrecv',
  'a=rtpmap:111 opus/48000/2',
  'a=fmtp:111 minptime=10;useinbandfec=1',
  'a=rtcp-fb:111 transport-cc',
  'a=rtpmap:103 ISAC/16000',
  'a=rtpmap:9 G722/8000',
  'a=rtpmap:0 PCMU/8000',
  'a=rtpmap:8 PCMA/8000',
  'a=rtpmap:13 CN/8000',
  'a=rtpmap:110 telephone-event/48000',
  'a=rtpmap:126 telephone-event/8000',
].join('\r\n');

describe('CheckCodecPreference', () => {
  let inputSDP: string;

  beforeAll(() => {
    inputSDP = 'm=audio 26834 UDP/TLS/RTP/SAVPF 111\na=rtpmap:111 opus/48000/2';
  });

  it('should return output same as input', () => {
    expect(CheckCodecPreference([], '')).toBe('');
  });

  it('should extract preferred codecs from sdp', () => {
    const expected = 'm=audio 26834 UDP/TLS/RTP/SAVPF 111\na=rtpmap:111 opus/48000/2';
    expect(CheckCodecPreference(['OPUS', 'PCMU'], inputSDP)).toBe(expected);
  });

  it('should return unchanged sdp when no preferred codecs found in sdp', () => {
    // 'OPUS1' is not a valid codec and not in the SDP — returning unchanged SDP
    // is safer than producing an empty m= line which Chrome would reject
    const expected = 'm=audio 26834 UDP/TLS/RTP/SAVPF 111\na=rtpmap:111 opus/48000/2';
    expect(CheckCodecPreference(['OPUS1'] as any, inputSDP)).toBe(expected);
  });

  // Real-world \r\n SDP tests — these catch the Chrome "Failed to parse codecs correctly" bug
  describe('real-world \\r\\n SDP (as received from SIP server)', () => {
    it('should keep only OPUS and PCMU on the m= line', () => {
      const result = CheckCodecPreference(['OPUS', 'PCMU'], REAL_WORLD_SDP);
      const mLine = result.match(/m=audio[^\r\n]*/)?.[0] ?? '';
      // Extract payload type list (everything after the profile field)
      const ptList = mLine.replace(/m=audio\s+\d+\s+\S+\s+/, '').trim().split(' ');
      expect(ptList).toContain('111'); // OPUS payload
      expect(ptList).toContain('0');   // PCMU payload
      expect(ptList).not.toContain('103'); // ISAC removed
      expect(ptList).not.toContain('8');   // PCMA removed
      expect(ptList).not.toContain('9');   // G722 removed
    });

    it('should remove a=rtpmap lines for non-preferred codecs', () => {
      const result = CheckCodecPreference(['OPUS', 'PCMU'], REAL_WORLD_SDP);
      expect(result).not.toContain('a=rtpmap:103'); // ISAC gone
      expect(result).not.toContain('a=rtpmap:9 G722'); // G722 gone
      expect(result).not.toContain('a=rtpmap:8');  // PCMA gone
      expect(result).toContain('a=rtpmap:111 opus/48000/2'); // OPUS kept
      expect(result).toContain('a=rtpmap:0 PCMU/8000'); // PCMU kept
    });

    it('should not leave orphaned payload types on m= line (Chrome codec parse safety)', () => {
      const result = CheckCodecPreference(['OPUS', 'PCMU'], REAL_WORLD_SDP);
      const mLine = result.match(/m=audio[^\r\n]*/)?.[0] ?? '';
      // Extract all payload types on m= line
      const mLineParts = mLine.split(' ').slice(3); // skip m=audio port profile
      // Every payload on m= must have a corresponding a=rtpmap or be a well-known static type
      const staticTypes = ['0', '8']; // PCMU, PCMA are static (no rtpmap required)
      mLineParts.forEach((pt) => {
        const hasRtpmap = result.includes(`a=rtpmap:${pt} `);
        const isStatic = staticTypes.includes(pt);
        expect(hasRtpmap || isStatic).toBe(true);
      });
    });

    it('should preserve \r\n line endings after processing', () => {
      const result = CheckCodecPreference(['OPUS'], REAL_WORLD_SDP);
      // Result must still use \r\n (not be corrupted to \n only)
      expect(result).toContain('\r\n');
    });
  });

  // Exact SDP received from Vobiz server in production (plain RTP/AVP, telephone-event payloads)
  describe('Vobiz production SDP (RTP/AVP with telephone-event)', () => {
    const VOBIZ_SDP = [
      'v=0',
      'o=Vobiz 1775349482 1775349483 IN IP4 65.1.145.87',
      's=Vobiz',
      'c=IN IP4 65.1.145.87',
      't=0 0',
      'm=audio 26810 RTP/AVP 102 8 0 103 101',
      'a=rtpmap:102 opus/48000/2',
      'a=fmtp:102 useinbandfec=1; maxaveragebitrate=30000',
      'a=rtpmap:8 PCMA/8000',
      'a=rtpmap:0 PCMU/8000',
      'a=rtpmap:103 telephone-event/48000',
      'a=fmtp:103 0-15',
      'a=rtpmap:101 telephone-event/8000',
      'a=fmtp:101 0-15',
      'a=ptime:20',
    ].join('\n');

    it('should keep only OPUS(102) and PCMU(0) on m= line', () => {
      const result = CheckCodecPreference(['OPUS', 'PCMU'], VOBIZ_SDP);
      const mLine = result.match(/m=audio[^\r\n]*/)?.[0] ?? '';
      const pts = mLine.replace(/m=audio\s+\d+\s+\S+\s+/, '').trim().split(/\s+/);
      expect(pts).toContain('102');
      expect(pts).toContain('0');
      expect(pts).not.toContain('8');
      expect(pts).not.toContain('103');
      expect(pts).not.toContain('101');
    });

    it('should remove ALL orphaned rtpmap lines including telephone-event', () => {
      const result = CheckCodecPreference(['OPUS', 'PCMU'], VOBIZ_SDP);
      expect(result).not.toContain('telephone-event');
      expect(result).not.toContain('a=rtpmap:8');
      expect(result).not.toContain('a=rtpmap:103');
      expect(result).not.toContain('a=rtpmap:101');
      expect(result).toContain('a=rtpmap:102 opus/48000/2');
      expect(result).toContain('a=rtpmap:0 PCMU/8000');
    });
  });
});
