import { logger } from "../utils/index.js";

// error handling middleware
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
