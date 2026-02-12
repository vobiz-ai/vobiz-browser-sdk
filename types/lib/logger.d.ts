import { Client } from './client';
import { LoggerUtil } from './utils/loggerUtil';
export declare type AvailableLogMethods = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'ALL' | 'OFF' | 'ALL-PLAIN';
export declare type AvailableFlagValues = 'ALL' | 'NONE' | 'REMOTEONLY' | 'LOCALONLY';
export interface DtmfOptions {
    sendDtmfType: string[];
}
interface LoggerOptions {
    enableDate?: boolean;
    loggingName?: 'VobizSDK';
    logMethod?: AvailableLogMethods;
}
/**
 * Create a new logger.
 */
declare class VobizLogger {
    private options;
    private logMethod;
    private loggerUtil;
    constructor(options?: LoggerOptions);
    info: (...rest: any[]) => void;
    debug: (...rest: any[]) => void;
    warn: (...rest: any[]) => void;
    error: (...rest: any[]) => void;
    setLevel: (method: AvailableLogMethods) => string;
    level: () => string;
    consolelogs: () => string[];
    /**
     * Enable sip logs if log level is ALL.
     * @param {AvailableLogMethods} debugLevel - passed by user while initializing client
     */
    enableSipLogs: (debugLevel: AvailableLogMethods) => void;
    private _setLevel;
    private _enableSipLogs;
    setLoggerUtil(loggerUtil: LoggerUtil): void;
    private _appendToQueue;
    /**
     * Add console logs in memory and achieve log hierarchy.
     * @param {AvailableLogMethods} filter - log type
     * @param {Array<String>} args - logger arguments
     */
    private logging;
    private _getLogsBatchData;
    private _sendBatchedLogsToServer;
    /**
   * Send logs to Vobiz.
   */
    send: (client: Client) => void;
}
export declare const Logger: VobizLogger;
export {};
