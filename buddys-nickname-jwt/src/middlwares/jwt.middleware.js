import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const JWTHandlerMiddleware = async (req, _res, next) => {
	const JWT_HASH = process.env.JWT_HASH || "node_training_salt";

	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		throw new AppError(400, "Missing token");
	}

	try {
		const decoded = jwt.verify(token, JWT_HASH);
		req.username = decoded.username;
	} catch (error) {
		throw new AppError(403, "Unauthorized token");
	}

	next();
};
