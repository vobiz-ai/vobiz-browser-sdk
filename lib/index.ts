/* eslint-disable*/
'use strict';
import { Client, ConfiguationOptions, ExtraHeaders } from './client';
import { Logger } from './logger';
import {
  CallSession,
  CallInfo,
  CallSessionOptions,
  SignallingInfo,
  MediaConnectionInformation,
} from './managers/callSession';

/** All event names emitted by the Vobiz SDK client */
export const VobizEvents = {
  // Auth
  ON_LOGIN: 'onLogin',
  ON_LOGIN_FAILED: 'onLoginFailed',
  ON_LOGOUT: 'onLogout',
  // Incoming call lifecycle
  ON_INCOMING_CALL: 'onIncomingCall',
  ON_INCOMING_CALL_CANCELED: 'onIncomingCallCanceled',
  ON_INCOMING_CALL_IGNORED: 'onIncomingCallIgnored',
  // Shared call lifecycle
  ON_CALL_ANSWERED: 'onCallAnswered',
  ON_CALL_TERMINATED: 'onCallTerminated',
  ON_CALL_FAILED: 'onCallFailed',
  // Media / connectivity
  ON_MEDIA_CONNECTED: 'onMediaConnected',
  ON_MEDIA_PERMISSION: 'onMediaPermission',
  ON_CALL_CONNECTED: 'onCallConnected',
  REMOTE_AUDIO_STATUS: 'remoteAudioStatus',
  ON_DTMF_RECEIVED: 'onDtmfReceived',
  // Network / registration
  ON_PERMISSION_DENIED: 'onPermissionDenied',
} as const;

class Vobiz {
  client: Client;
  constructor(options: ConfiguationOptions) {
    // Check for existing instance of Vobiz object
    if (typeof window['_VobizInstance' as any] === 'object') {
      Logger.info('window.Vobiz object and its instance already exist');
      this.client = (window as any)._VobizInstance
    } else {
      this.client = new Client(options);
    }
  }

}
Object.defineProperty(Vobiz, 'client', { enumerable: true });

export default Vobiz;
export type {
  Client,
  ConfiguationOptions,
  ExtraHeaders,
  CallSession,
  CallInfo,
  CallSessionOptions,
  SignallingInfo,
  MediaConnectionInformation,
};

module.exports = Vobiz;
module.exports.VobizEvents = VobizEvents;
