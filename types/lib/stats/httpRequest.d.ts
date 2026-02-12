import { Client } from '../client';
import { FeedbackObject } from '../utils/feedback';
export interface CallStatsValidationResponse {
    data: string;
    is_rtp_enabled: boolean;
}
export interface PreSignedUrlRequest {
    username: string;
    password: string;
    domain: string;
    calluuid: string;
    accessToken: string;
}
export interface PreSignedUrlResponse {
    data: string;
}
/**
 * Get callstats key and rtp enabled status.
 * @param {String} userName
 * @param {String} password
 * @returns Fulfills with call insights key and rtp enabled status or reject with error
 */
export declare const validateCallStats: (userName: string, password: any, isAccessToken: boolean) => Promise<CallStatsValidationResponse | string>;
/**
 * Get presigned s3 url to upload console logs.
 * @param {PreSignedUrlRequest} preSignedUrlBody - request body for getting pre-signed s3 url
 * @returns Fulfills with pre-signed s3 url or reject with error
 */
export declare const getPreSignedS3URL: (preSignedUrlBody: PreSignedUrlRequest, isAccessToken: boolean) => Promise<PreSignedUrlResponse | string>;
/**
 * Upload logs to s3 bucket using pre-signed s3 url.
 * @param {PreSignedUrlResponse} preSignedUrlReponse - contains pre-signed s3 url
 * @param {FeedbackObject} feedback - contains call rating, issues faced during call and remarks
 * @returns Fulfills with done status or reject with error
 */
export declare const uploadConsoleLogsToBucket: (preSignedUrlReponse: PreSignedUrlResponse, feedback: FeedbackObject) => Promise<string>;
export declare const fetchIPAddress: (client: Client) => Promise<string | Error>;
