import winston from "winston";

// ckeching node env
const NODE_ENV = process.env.NODE_ENV || "dev";

// destucture winston
const { createLogger, transports } = winston;
const { combine, timestamp, printf, errors } = winston.format;

export const logger = createLogger({
	level: NODE_ENV === "dev" ? "debug" : "info",
	format: combine(
		timestamp(),
		errors({ stack: true }),
		printf(({ timestamp, level, message, stack }) => {
			return `${timestamp} ${level.toUpperCase()} ${stack || JSON.stringify(message)}`;
		}),
	),
	transports: [
		new transports.Console(),
		new transports.File({ level: "info", filename: "logs/info.log" }),
		new transports.File({ level: "error", filename: "logs/error.log" }),
	],
});
