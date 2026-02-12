import { Client } from '../client';
/**
 * Initializes the Account.
 */
declare class Account {
    /**
     * Reference to the client class
     */
    private cs;
    private isVobizSocketConnected;
    /**
     * SipLib Message class to execute ping-pong
     */
    private message;
    /**
     * Holds the boolean whether failed event is triggered
     */
    isFailedMessageTriggered: boolean;
    /**
     * Holds the boolean whether failed event is triggered
     */
    registerRefreshTimer: number;
    /**
     * Credentials object
     */
    private credentials;
    /**
     * Access Token Credentials object
     */
    private accessTokenCredentials;
    /**
     * Hold the value of number of retry counts done
     */
    private fetchIpCount;
    /**
     * Validate the account credentials and session.
     */
    validate: (callback: any) => boolean;
    /**
     * Handles signalling, transport account creation and its listners
     */
    setupUserAccount: () => void;
    /**
     * Creates signalling transport and account.
     */
    create: () => boolean;
    /**
     * Creates account, transport event listeners.
     */
    createListeners: () => void;
    reinviteCounter: number;
    /**
     * @construtor
     * @param {Client} clientObject - client reference
     * @param {String} userName
     * @param {String} password
     * @private
     */
    constructor(clientObject: Client, userName: string, password: string, accessToken: string | null, registerRefreshtimer: number);
    private _validate;
    private sendReInvite;
    private setupUAConfig;
    private _setupUserAccount;
    private _create;
    private tiggerNetworkChangeEvent;
    private _createListeners;
    /**
     * Triggered when web socket is connected.
     * @param {UserAgentConnectedEvent} evt
     */
    private _onConnected;
    /**
     * Triggered when web socket is disconnected.
     * @param {UserAgentDisconnectedEvent} evt
     */
    private _onDisconnected;
    /**
     * Triggered when the user is logged in.
     */
    private _onRegistered;
    /**
     * Triggered when user is logged out.
     * @param {Object} reason - Unregistration reason
     */
    private _onUnRegistered;
    /**
     * Triggered when user credentials are wrong.
     * @param {Object} error - Login failure error
     */
    private _onRegistrationFailed;
    /**
     * Triggered when a transaction is created.
     * @param {Any} evt - transaction details
     */
    private _onNewTransaction;
    /**
     * Triggered when a new call is performed/received.
     * @param {UserAgentNewRtcSessionEvent} evt
     */
    private _onNewRTCSession;
    /**
     * Check previous call sessions and incoming call invites.
     * @param {UserAgentNewRtcSessionEvent} evt
     */
    private _validateRTCSession;
}
export default Account;
