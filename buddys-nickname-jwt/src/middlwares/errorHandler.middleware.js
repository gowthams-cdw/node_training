import { logger } from "../utils/logger.js";

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
