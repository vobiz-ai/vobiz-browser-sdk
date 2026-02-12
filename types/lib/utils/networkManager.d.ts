import { Client } from '../client';
interface PingPong {
    client: Client;
    networkChangeInterval: number;
    messageCheckTimeout: number;
}
export declare const ConnectionState: {
    CONNECTED: string;
    DISCONNECTED: string;
};
export declare const restartStatSocket: (client: Client) => void;
export declare const socketReconnectionRetry: (client: any) => void;
export declare const getNetworkData: (client: Client, ipAddress: string | Error) => {
    newNetworkInfo: {
        networkType: any;
        ip: string;
    };
    previousNetworkInfo: {
        networkType: string;
        ip: string;
    };
};
export declare const sendInfoReInvite: (client: Client, ipAddress: string) => void;
export declare const sendNetworkChangeEvent: (client: Client, ipAddress: string) => Promise<void>;
export declare const reconnectSocket: (client: Client) => void;
export declare const startPingPong: ({ client, networkChangeInterval, messageCheckTimeout, }: PingPong) => void;
export declare const resetPingPong: ({ client, networkChangeInterval, messageCheckTimeout, }: PingPong) => void;
export {};
