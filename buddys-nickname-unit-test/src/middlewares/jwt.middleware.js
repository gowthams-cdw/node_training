import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { logger } from "../utils/logger.js";
import { isValidToken } from "../utils/tokenStore.js";

/**
 * @desc JWT handling middleware to verify the authenticity of the user based on the provided token
 * @param {*} req - request from the client
 * @param {*} _res - response from the server
 * @param {*} next - next middleware function
 */
export const JWTHandlerMiddleware = async (req, _res, next) => {
	const JWT_HASH = process.env.JWT_HASH || "$2b$10$8StE1gmrFPlzMp.zVlOw2.";

	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		throw new AppError(400, "Missing token");
	}

	if (!isValidToken(token)) {
		throw new AppError(403, "Invalid token");
	}

	try {
		const decoded = jwt.verify(token, JWT_HASH);
		req.username = decoded.username;
		req.token = token;
	} catch (error) {
		logger.error(error);
		throw new AppError(403, "Unauthorized token");
	}

	next();
};
