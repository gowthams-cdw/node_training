// imports
import { readBuddies, writeBuddies } from "../services/index.js";
import { AppError, asyncHandler } from "../utils/index.js";

/**
 * @desc 	Get all buddies
 * @route 	GET /buddies
 * @param {*} req  from the client
 * @param {*} res from the server
 * @return {Array} list of all buddies
 */
export const getAllBuddies = asyncHandler((_req, res) => {
	const buddies = readBuddies();
	res.status(200).json(buddies);
});

/**
 * @desc 	Get buddy by id or name
 * @route 	GET /buddies?name=John or GET /buddies?id=EMP12345
 * @param {*} req  from the client
 * @param {*} res from the server
 * @return {Object} buddy object
 */
export const getBuddy = asyncHandler((req, res) => {
	const { id, name } = req.query;
	const buddies = readBuddies();

	const buddy = buddies.filter(
		(buddy) =>
			buddy.employeeId === id ||
			buddy.realName?.toLowerCase() === name?.toLowerCase(),
	);

	if (!buddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.status(200).json(buddy);
});

/**
 * @desc 	Create new buddy
 * @route 	POST /buddies
 * @param {*} req  from the client
 * @param {*} res from the server
 * @return {Object} newly created buddy object
 */
export const createNewBuddy = asyncHandler((req, res) => {
	// get existing buddies
	const buddies = readBuddies();
	const { realName, nickName, dob, hobbies } = req.body;

	if (!realName || !nickName || !dob || !hobbies || hobbies.length === 0) {
		throw new AppError(400, "All fields are required");
	}

	const newBuddy = { ...req.body, employeeId: `EMP${Date.now()}` };
	buddies.push(newBuddy);
	writeBuddies(buddies);

	res.status(201).json(newBuddy);
});

/**
 * @desc 	Update buddy by id
 * @route 	PUT /buddies/:id
 * @param {*} req  from the client
 * @param {*} res from the server
 * @return {Object} updated buddy object
 */
export const updateBuddy = asyncHandler((req, res) => {
	const { id } = req.params;
	const buddies = readBuddies();

	const index = buddies.findIndex((buddy) => buddy.employeeId === id);

	if (index === -1) throw new AppError(404, "Buddy not found");

	buddies[index] = { ...buddies[index], ...req.body };

	writeBuddies(buddies);

	res.status(200).json(buddies[index]);
});

/**
 * @desc 	Delete buddy by id
 * @route 	DELETE /buddies/:id
 * @param {*} req  from the client
 * @param {*} res from the server
 * @return {Object} success message
 */
export const deleteBuddy = asyncHandler((req, res) => {
	const { id } = req.params;
	const buddies = readBuddies();

	const filteredBuddies = buddies.filter((buddy) => buddy.employeeId !== id);

	// if original length === new length
	// nothing is deleted
	// so buddy not found
	if (filteredBuddies.length === buddies.length)
		throw new AppError(404, "Buddy not found");

	writeBuddies(filteredBuddies);

	res.status(200).json({ message: "Deleted successfully" });
});
