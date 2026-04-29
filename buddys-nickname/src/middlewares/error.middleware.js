/**
 * @desc 	Global error handling middleware
 * @route 	Any route that throws an error
 * @param {*} err thrown error object
 * @param {*} _req from the client
 * @param {*} res from the server
 * @param {*} _next next middleware function
 */
export const errorHandler = (err, _req, res, _next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	res.status(statusCode).json({
		message,
	});
};
