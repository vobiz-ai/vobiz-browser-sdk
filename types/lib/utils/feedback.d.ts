export interface FeedbackObject {
    overall: number;
    comment: string;
}
/**
 * Check feedback information.
 * @param {String} callUUID - specify the CallUUID for which feedback needs to be sent
 * @param {String} starRating - Rate the call from 1 to 5
 * @param {String} note - Send any remarks
 * @param {Array<String>} issues - Provide suspected issues
 * @param {String} userName
 * @param {Boolean} isLoggedIn - Loggedin status
 */
export declare const validateFeedback: (callUUID: string, starRating: string, note: string, issues: string[], userName: string, isLoggedIn: boolean) => Promise<FeedbackObject>;
