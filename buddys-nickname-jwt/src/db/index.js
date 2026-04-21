import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
	try {
		const MONGO_URI = process.env.MONGO_URI;

		if (!MONGO_URI) {
			throw new Error("MONGO_URI is missing");
		}

		await mongoose.connect(MONGO_URI);
		logger.info("MongoDB connectted successfully!")
	} catch (error) {
		throw new Error(error);
	}
};
