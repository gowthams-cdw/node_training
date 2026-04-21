export class AppError extends Error {
	constructor(statusCode, message) {
		super(message);

		this.status = "failure";
		this.statusCode = statusCode;
		this.message = message;
	}
}
