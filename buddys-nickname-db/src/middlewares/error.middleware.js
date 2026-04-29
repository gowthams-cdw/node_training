import { logger } from "../utils/index.js";

/**
 * @desc error handling middleware
 * @param {*} err - error object thrown by the application
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @param {*} _next - next middleware function
 * @returns {Object} - error response with status code and message
 */
export const errorHandler = (err, req, res, _next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	logger.error({
		requestId: req.requestId,
		statusCode,
		message,
		error: err.stack,
	});

	res.status(statusCode).json({
		message,
	});
};
