/**
 * @desc custom error class for application errors, with status codes and message
 */
export class AppError extends Error {
	constructor(statusCode, message) {
		super(message);

		this.status = "failure";
		this.statusCode = statusCode;
		this.message = statusCode.toString().startsWith("5")
			? "Something went wrong"
			: message;
	}
}
