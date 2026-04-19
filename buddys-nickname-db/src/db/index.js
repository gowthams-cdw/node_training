import mongoose from "mongoose";
import { logger } from "../utils/index.js";

export const connectDB = async () => {
	const MONGO_URI = process.env.MONGO_URI;

	if (!MONGO_URI) {
		throw new Error("MONGO_URI not defined");
	}

	try {
		await mongoose.connect(MONGO_URI);
		logger.info("MongoDB connected");
	} catch (error) {
		logger.error("MongoDB connection failed", error);
		throw error;
	}
};
