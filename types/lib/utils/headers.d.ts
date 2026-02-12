/**
 * Check if extra header key is valid.
 * @param {String} key - extra header key
 */
export declare const checkExtraHeaderKey: (key: string) => boolean;
/**
 * Check if extra header value is valid.
 * @param {String} key - extra header value
 */
export declare const checkExtraHeaderVal: (value: string) => boolean;
/**
 * Check if extra header jwt value is valid.
 * @param {String} key - extra header jwt value
 */
export declare const checkExtraHeaderJWTVal: (value: string) => boolean;
/**
 * Extract extra headers from incoming call request.
 * @param {Any} request - call request
 * @param {Any} headers - all request headers
 */
export declare const receiveExtraHeader: (request: any, headers: any) => any;
