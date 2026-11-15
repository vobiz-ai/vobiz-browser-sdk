import { Client } from '../../lib/client';

// Minimal stand-in for a JsSIP RTCSession: records the options passed to
// hold()/unhold() and lets the test decide when the far end "confirms".
const makeFakeSession = () => {
  const state = { local: false, remote: false };
  const calls: { method: string; opts: any; done: () => void }[] = [];
  const track = { kind: 'audio', enabled: true };
  const session = {
    connection: { getSenders: () => [{ track }] },
    isEstablished: () => true,
    isOnHold: () => ({ ...state }),
    hold: (opts: any, done: () => void) => {
      calls.push({ method: 'hold', opts, done });
      return true;
    },
    unhold: (opts: any, done: () => void) => {
      calls.push({ method: 'unhold', opts, done });
      return true;
    },
  };
  return { session, state, calls, track };
};

describe('Client hold/unhold', () => {
  let client: any;

  beforeAll(() => {
    (window as any).navigator.mediaDevices = {
      enumerateDevices: () => Promise.resolve([]),
      getUserMedia: () => Promise.resolve({ getTracks: () => [] }),
      addEventListener: () => {},
    };
    (window as any).webkitSpeechRecognition = function SpeechRecognition() {};
  });

  beforeEach(() => {
    client = new Client({ debug: 'OFF' } as any);
  });

  it('returns false when there is no active call', () => {
    client._currentSession = null;
    expect(client.hold()).toBe(false);
    expect(client.unhold()).toBe(false);
    expect(client.isOnHold()).toBe(false);
  });

  it('sends hold and resume as a re-INVITE (not UPDATE) and emits events once confirmed', () => {
    const { session, state, calls } = makeFakeSession();
    const callInfo = { callUUID: 'abc' };
    client._currentSession = {
      session,
      callUUID: 'abc',
      getCallInfo: () => callInfo,
    };
    const onHold = jest.fn();
    const onResume = jest.fn();
    client.on('onCallHold', onHold);
    client.on('onCallResume', onResume);

    expect(client.hold()).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe('hold');
    expect(calls[0].opts.useUpdate).toBeFalsy();
    // nothing is emitted until the far end confirms
    expect(onHold).not.toHaveBeenCalled();
    expect(client.isOnHold()).toBe(false);

    state.local = true;
    calls[0].done();
    expect(onHold).toHaveBeenCalledWith(callInfo);
    expect(client.isOnHold()).toBe(true);

    expect(client.unhold()).toBe(true);
    expect(calls).toHaveLength(2);
    expect(calls[1].method).toBe('unhold');
    expect(calls[1].opts.useUpdate).toBeFalsy();
    expect(onResume).not.toHaveBeenCalled();

    state.local = false;
    calls[1].done();
    expect(onResume).toHaveBeenCalledWith(callInfo);
    expect(client.isOnHold()).toBe(false);
  });

  it('stops sending mic audio while on hold and restores it on resume', () => {
    const { session, state, calls, track } = makeFakeSession();
    client._currentSession = { session, callUUID: 'abc', getCallInfo: () => ({}) };

    expect(client.hold()).toBe(true);
    expect(track.enabled).toBe(false); // off as soon as hold is requested
    state.local = true;
    calls[0].done();

    expect(client.unhold()).toBe(true);
    expect(track.enabled).toBe(false); // stays off until the far end confirms the resume
    state.local = false;
    calls[1].done();
    expect(track.enabled).toBe(true);
  });

  it('keeps the mic off after resume if the user muted the call', () => {
    const { session, state, calls, track } = makeFakeSession();
    client._currentSession = { session, callUUID: 'abc', getCallInfo: () => ({}) };
    client.isCallMuted = true;

    client.hold();
    state.local = true;
    calls[0].done();
    client.unhold();
    state.local = false;
    calls[1].done();
    expect(track.enabled).toBe(false);
  });

  it('restores the mic if the hold request could not be sent', () => {
    const { session, track } = makeFakeSession();
    session.hold = () => false;
    client._currentSession = { session, callUUID: 'abc', getCallInfo: () => ({}) };
    expect(client.hold()).toBe(false);
    expect(track.enabled).toBe(true);
  });
});
