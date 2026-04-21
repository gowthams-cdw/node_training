/**
 * @desc 	Wrapper function for async functions to handle errors and redirect to middleware
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - The wrapped function
 */
export const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);
