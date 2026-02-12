import { UserAgentNewRtcSessionEvent } from 'vobiz-jssip';
import { CallSession } from './callSession';
import { Client } from '../client';
/**
 * Get incoming call object based on CallUUID.
 * @param {String} callUUID - provide active CallUUID
 * @param {Client} clientObject - client reference
 * @returns Incoming call session information
 */
export declare const getCurrentIncomingCall: (callUUID: string, clientObject: Client) => CallSession | null;
/**
 * Creates incoming call event listeners.
 */
export declare const createIncomingCallListeners: (incomingCall: CallSession) => void;
/**
 * Create call session for incoming call.
 * @param {Client} clientObject - client reference
 * @param {UserAgentNewRtcSessionEvent} evt - rtcsession information
 */
export declare const createIncomingSession: (clientObject: Client, evt: UserAgentNewRtcSessionEvent) => void;
/**
 * Validate incoming call actions.
 * @param {String} actionOnOtherIncomingCalls - list of incoming call actions
 */
export declare const checkIncomingCallAction: (actionOnOtherIncomingCalls: string) => boolean;
/**
 * Answer incoming call and perform actions for other incoming calls.
 * @param {CallSession} curIncomingCall - current incoming call
 * @param {String} actionOnOtherIncomingCalls - list of incoming call actions
 */
export declare const answerIncomingCall: (curIncomingCall: CallSession, actionOnOtherIncomingCalls: string) => Promise<void>;
/**
 * Update incoming call information for ignore state.
 * @param {CallSession} curIncomingCall - current incoming call
 */
export declare const handleIgnoreState: (curIncomingCall: CallSession) => void;
