export interface SemverParserVersion {
    version: string;
    matches: boolean;
    major: number;
    minor: number;
    patch: number;
    pre: Array<string | number>;
    build: Array<string | number>;
}
/**
 * Get OS name on which SDK is running.
 */
export declare const getOS: () => string;
/**
 * Check if media devices are supported in browser.
 */
export declare const checkMediaDevices: () => void;
/**
 * Get SDK version.
 */
export declare const getSDKVersion: () => SemverParserVersion;
/**
 * Get client version parsed through semver.
 */
export declare const getClientVersion: () => SemverParserVersion | number[];
