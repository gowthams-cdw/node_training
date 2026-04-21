import winston from "winston";

// destructure winston
const { createLogger, transports } = winston;
const { combine, printf, timestamp, errors } = winston.format;

// get runtime from env
const NODE_ENV = process.env.NODE_ENV || "dev";

export const logger = createLogger({
	level: NODE_ENV === "dev" ? "debug" : "info",
	format: combine(
		timestamp(),
		errors({ stack: true }),
		printf(
			({ timestamp, level, message, stack }) =>
				`${timestamp} ${level.toUpperCase()} ${stack || JSON.stringify(message)}`,
		),
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: "logs/info.log" }),
		new transports.File({ filename: "logs/error.log", level: "error" }),
	],
});
