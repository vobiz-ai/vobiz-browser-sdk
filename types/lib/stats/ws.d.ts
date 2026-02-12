import { Client } from '../client';
/**
 * Initialize stats socket.
 */
export declare class StatsSocket {
    /**
     * URL to establish websocket connection
     * @private
     */
    url: string;
    /**
     * Holds the instance of websocket
     * @private
     */
    ws: null | WebSocket;
    /**
     * Holds a bollean which determines whether the socket is trying for a connection
     * @private
     */
    isConnecting: boolean;
    /**
     * Stores the messages in buffer if websocket is unable to send message
     * @private
     */
    messageBuffer: string[];
    /**
     * @constructor
     * @private
     */
    constructor();
    /**
     * Send continous keepalive heartbeat to Vobiz stats websocket server.
     * @param {Client} cs - client reference
     */
    heartbeat(cs: Client): boolean;
    /**
     * Create a web socket for stats and add event listeners.
     */
    connect: () => void;
    /**
     * Close the web socket.
     */
    disconnect: () => void;
    /**
     * Check if web socket is open or not.
     */
    isConnected: () => boolean;
    /**
     * Send messages to the socket.
     * @param {Object} message - call stats(Answered/RTP/Summary/Feedback/Failure Events)
     */
    send: (message: {
        [key: string]: any;
    }, client: Client) => boolean;
    /**
     * Reconnect to the socket
     */
    reconnect: () => void;
}
