/**
 * @desc async handler to catch errors in async functions
 * @param {*} fn - wrapper function
 * @returns {Function} - wrapped function with error handling
 */
export const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);
