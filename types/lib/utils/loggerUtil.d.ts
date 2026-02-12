import { Client } from "../client";
export declare class LoggerUtil {
    private static instance;
    private sipCallID;
    private userName;
    private client;
    constructor(client: Client);
    static getInstance(): LoggerUtil | null;
    getSipCallID(): string;
    setSipCallID(value: string): void;
    getUserName(): string;
    setUserName(value: string): void;
}
