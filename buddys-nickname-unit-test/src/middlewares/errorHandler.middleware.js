import { logger } from "../utils/logger.js";

/**
 * @desc error handling middleware to catch all errors thrown in the app and send a proper response to the client
 * @param {*} err - thrown error object
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @param {*} _next - next middleware function
 */
export const errorHandlerMiddleware = (err, req, res, _next) => {
	const requestId = req.requestId;
	const {
		statusCode = 500,
		message = "Internal server error",
		status = "failure",
	} = err;

	logger.error({
		requestId,
		statusCode,
		message,
		status,
	});

	res.status(statusCode).send({
		status,
		message,
	});
};
