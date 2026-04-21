// imports

import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/index.js";

/**
 * @desc logger middleware
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @param {*} next - next middleware function
 */
export const requestMiddleware = (req, res, next) => {
	const start = Date.now();
	const requestId = uuidv4();

	// add requestId to original request
	req.requestId = requestId;

	logger.info({
		type: "request",
		requestId,
		url: req.originalUrl,
		method: req.method,
		query: req.query,
		body: req.body,
		ip: req.ip,
	});

	res.on("finish", () => {
		const duration = Date.now() - start;
		const { statusCode } = res;

		const logData = {
			type: "response",
			requestId: req.requestId,
			statusCode: statusCode,
			duration: `${duration}ms`,
		};

		if (statusCode >= 500) {
			logger.error(logData);
		} else if (statusCode >= 400) {
			logger.warn(logData);
		} else if (statusCode >= 200) {
			logger.info(logData);
		}
	});

	next();
};
