export declare const getWebRTCStats: (connection: any) => Promise<any>;
/**
 * Detect if one way audio exists before making the call.
 * @param {Function} cb - Handle error if one way audio is present, otherwise make the call
 */
export declare const detectOWA: (cb: (data: any, err: any) => void) => void;
/**
 * Handle error if one way audio is present, otherwise make the call.
 * @param {Any} res - consume result when no one way audio is present
 * @param {Any} err - error when one way audio is present
 * @param {Function} onError - callback for emitting error events
 * @param {Function} readyForCall - callback for making the call
 */
export declare const owaCallback: (res: any, err: any, onError: (e: string) => void, readyForCall: () => void) => boolean;
/**
 * Detect if one way audio exists after answering the call.
 * @param {Any} connection - media connection information
 */
export declare const owaNotification: (connection: any) => void;
