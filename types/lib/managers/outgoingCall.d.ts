import { UserAgentNewRtcSessionEvent } from 'vobiz-jssip';
import { Client, ExtraHeaders } from '../client';
/**
 * Perform outgoing call.
 * @param {Client} clientObject - client reference
 * @param {ExtraHeaders} extraHeaders - Custom headers which are passed in the INVITE.
 * They should start with 'X-PH'
 * @param {String} phoneNumber  - it can be a sip endpoint/number
 */
export declare const makeCall: (clientObject: Client, extraHeaders: ExtraHeaders, phoneNumber: string) => boolean;
/**
 * Create call session for outgoing call.
 * @param {UserAgentNewRtcSessionEvent} evt - rtcsession information
 */
export declare const createOutgoingSession: (evt: UserAgentNewRtcSessionEvent) => void;
