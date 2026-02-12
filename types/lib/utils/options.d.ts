import { ConfiguationOptions } from '../client';
/**
 * Validate all options we get during initialization.
 * @param {ConfiguationOptions} options - client configuration parameters
 * @returns Validated options
 */
declare const validateOptions: (options: ConfiguationOptions) => ConfiguationOptions;
export default validateOptions;
