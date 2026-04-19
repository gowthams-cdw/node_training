// error handling middleware
export const errorHandler = (err, _req, res, _next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	res.status(statusCode).json({
		message,
	});
};
