import { Client } from '../client';
import { DeviceAudioInfo } from '../stats/nonRTPStats';
export interface RingToneDevices {
    set: (id: string) => void;
    get: () => string;
    reset: () => void;
    media: () => HTMLElement | null;
}
export interface InputDevices {
    set: (id: string) => void;
    get: () => string;
    reset: () => void;
}
export interface OutputDevices {
    set: (id: string) => void;
    get: () => string;
    reset: () => void;
    media: (source?: string) => HTMLElement | null;
}
export interface DeviceDictionary {
    devices: MediaDeviceInfo[];
    audioRef: string[];
}
/**
 * Add audio constraints to client reference.
 * @param {Client} _clientObject - client reference
 */
export declare const setAudioContraints: (_clientObject: Client) => void;
/**
 * Get list of input or output audio devices.
 * @param {String} filterBy - pass input/output to filter the devices
 * @returns Fulfills with a list of audio devices or reject with error
 */
export declare const availableDevices: (filterBy?: string | undefined) => Promise<MediaDeviceInfo[]>;
/**
 * Allow media permission forcefully to reveal available devices.
 * @param {String} arg - returns media stream if arg is "returnStream"
 * @returns Fulfills with a media stream if 'returnStream' is passed or resolve with success.
 * If error occurs reject with error.
 */
export declare const revealAudioDevices: (arg?: string | undefined) => Promise<MediaStream | string>;
export declare const speechListeners: () => void;
/**
 * Mute the local stream.
 */
export declare const mute: () => void;
/**
 * Mute audio state.
 * @param {Client} client - client reference
 */
export declare const resetMuteOnHangup: () => void;
/**
 * Collect realtime Audio levels for local and remote streams.
 * @param {Client} client - client reference
 */
export declare const startVolumeDataStreaming: (client: Client) => void;
/**
 * Stopping the requesting frame. It would stop emitting the real time audio levels.
 */
export declare const stopVolumeDataStreaming: () => void;
export declare const replaceStream: (client: Client, constraints: any) => Promise<void>;
/**
 * Add audio device information whenever device is changed.
 * @param {Boolean} store - pass true to store information in Client object for reference
 * @returns Fulfills with audio device information or reject with error
 */
export declare const audioDevDictionary: (store?: boolean | undefined) => Promise<DeviceDictionary | boolean>;
/**
 * Return if the app consuming Browser SDK is electron app or not.
 */
export declare const isElectronApp: () => boolean;
export declare const matchDevices: (activeInputDeviceGroupId: any, activeOutputDeviceGroupId: any, activeInputDevice: any, activeOutputDevice: any) => boolean;
/**
 * Get input and output audio device information to send to Vobiz stats.
 * @returns Fulfills with audio device information or reject with error
 */
export declare const getAudioDevicesInfo: () => Promise<DeviceAudioInfo>;
/**
 * Updating the default input & output device
 */
export declare const updateWindowDeviceList: (deviceList: any) => void;
/**
 * Check the input & output audio device for windows machine such that both belong to same groupid
 */
export declare const setAudioDeviceForForWindows: (devices: any, lastConnectedMicDevice: any, lastConnectedSpeakerDevice: any) => void;
/**
 * Check if input or output audio device has changed.
 */
export declare const checkAudioDevChange: () => void;
/**
 * Add getters and setters for input audio devices.
 */
export declare const inputDevices: InputDevices;
/**
 * Add getters and setters for output audio devices.
 */
export declare const outputDevices: OutputDevices;
/**
 * Add getters and setters for ringtone which is played during the call.
 */
export declare const ringtoneDevices: RingToneDevices;
/**
 * Unmute the local stream.
 */
export declare const unmute: () => void;
/**
 * Stop all tracks in the local stream.
 */
export declare const updateAudioDeviceFlags: () => void;
/**
 * Set the callback which is used for storing list of audio device labels.
 * @param {Function} setter - callback for storing device labels
 */
export declare const audioDevDicSetter: (setter: (set: any) => void) => void;
/**
 * Detect if input or output audio device has changed.
 */
export declare const detectDeviceChange: () => void;
