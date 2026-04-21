/**
 * @desc custom error class to use on application errors
 * @params {number} statusCode - HTTP status code
 * @param {string} message - error message
 */
export class AppError extends Error {
	constructor(statusCode, message) {
		super(message);

		this.statusCode = statusCode;
	}
}
