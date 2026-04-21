/**
 * @desc custom error handling class for application errors
 * @param {Number} statusCode - error status code
 * @param {string} message - error message
 */
export class AppError extends Error {
	constructor(statusCode, message) {
		super(message);

		this.statusCode = statusCode;
	}
}
