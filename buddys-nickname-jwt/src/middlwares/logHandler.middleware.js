import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";

export const logHandlerMiddleware = (req, res, next) => {
	// get the start time
	const start = Date.now();

	// attach a unique id for further search
	const requestId = uuidv4();
	req.requestId = requestId;

	// destructure req
	const { method, originalUrl, body, query, ip } = req;

	logger.info({
		type: "request",
		requestId,
		method,
		url: originalUrl,
		body,
		query,
		ip,
	});

	res.on("finish", () => {
		// get current time
		const curTime = Date.now();

		// get duration
		const duration = curTime - start;

		// destructure response
		const { statusCode } = res;

		const logData = {
			type: "response",
			requestId,
			statusCode,
			duration: `${duration}s`,
		};

		if (statusCode >= 500) {
			logger.error(logData);
		} else if (statusCode >= 400) {
			logger.debug(logData);
		} else if (statusCode >= 200) {
			logger.info(logData);
		}
	});

	next();
};
