// imports

import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/index.js";
import { errorHandler, requestMiddleware } from "./middlewares/index.js";
import { buddiesRouter } from "./routes/index.js";
import { logger } from "./utils/logger.js";

// dotenv config
dotenv.config();

// express app initialization
const app = express();

// express middleware
app.use(express.json());

// cors middleware
app.use(cors());

// logging middleware
app.use(requestMiddleware)

// set up routes
app.use("/buddies", buddiesRouter);

// set up middleware to catch errors
app.use(errorHandler);

/**
 * @desc function to initialize the server
 * @desc connects to the database and starts the server
 */
const init = async () => {
	try {
		// mongodb setup
		await connectDB();

		// make app to listen configured the port
		const PORT = process.env.PORT || 3000;

		app.listen(PORT, () => {
			logger.info(`Server started at http://localhost:${PORT}/`);
		});
	} catch (error) {
		logger.error("Failed to start the server", error);
		process.exit(1);
	}
};

// call init function
init();
