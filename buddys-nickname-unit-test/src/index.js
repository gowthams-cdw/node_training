// imports

import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { handleError } from "./middlewares/errorHandler.middleware.js";
import { logRequestAndResponse } from "./middlewares/logHandler.middleware.js";
import { userRouter } from "./routes/user.route.js";
import { connectDB } from "./services/db.service.js";
import { logger } from "./utils/logger.js";

// env config
dotenv.config();

// express app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(logRequestAndResponse);

// set up routers
app.use("/users", userRouter);

// error middleware
app.use(handleError);

// function to init server
const init = async () => {
	try {
		// db startup
		await connectDB();

		// server startup
		const PORT = process.env.PORT || 3000;

		app.listen(PORT, () => {
			logger.info(`App started at http://localhost:${PORT}`);
		});
	} catch (error) {
		logger.error(`Failed to start server: ${error}`);
		process.exit(1);
	}
};

// call the init function
init();
