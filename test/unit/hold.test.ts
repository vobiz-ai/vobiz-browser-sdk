import { Client } from '../../lib/client';

// Minimal stand-in for a JsSIP RTCSession: records the options passed to
// hold()/unhold() and lets the test decide when the far end "confirms".
const makeFakeSession = () => {
  const state = { local: false, remote: false };
  const calls: { method: string; opts: any; done: () => void }[] = [];
  const session = {
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
  return { session, state, calls };
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
});
