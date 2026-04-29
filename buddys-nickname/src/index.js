// imports

import fs from "node:fs";
import * as dotenv from "dotenv";
import express from "express";
import { DATA_FILE_PATH } from "./constants/index.js";
import { errorHandler } from "./middlewares/index.js";
import { buddiesRouter } from "./routes/index.js";

// dotenv config
dotenv.config();

// set up data file if not exists
if (!fs.existsSync(DATA_FILE_PATH)) {
	fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([]));
}

// express app initialization
const app = express();

// express middleware
app.use(express.json());

// set up routes
app.use("/buddies", buddiesRouter);

// set up middleware to catch errors
app.use(errorHandler);

// make app to listen configured the port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}/`);
});
