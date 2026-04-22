/**
 * @desc wrapper function to run async calls and catch errors and pass to next middleware
 * @param {*} fn - wrapper function
 * @returns {function} wrapper function
 */
export const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);
