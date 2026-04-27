// imports
import {
	createBuddy,
	deleteBuddy,
	getAllBuddies,
	getBuddy,
	updateBuddy,
} from "../services/buddies.services.js";
import { AppError, asyncHandler } from "../utils/index.js";

/**
 * @desc get all buddies
 * @route GET /buddies
 * @param {*} _req - request from the client
 * @param {*} res - response from the server
 * @returns {Array} - list of all buddies
 */
export const getAllBuddiesHandler = asyncHandler(async (_req, res) => {
	const buddies = await getAllBuddies();
	res.status(200).json(buddies);
});

/**
 * @desc get buddy by id or name
 * @route GET /buddies/search
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @returns {Object} - buddy object if found
 */
export const getBuddyHandler = asyncHandler(async (req, res) => {
	const { id, name } = req.query;

	if (!id && !name) {
		throw new AppError(400, "Provide either id or name to search");
	}

	const buddy = await getBuddy(id ? id : name, id ? "id" : "name"); // identifier + identifierType

	if (!buddy || buddy.length === 0) {
		throw new AppError(404, "Buddy not found");
	}

	res.status(200).json(buddy);
});

/**
 * @desc create a new buddy
 * @route POST /buddies
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @returns {Object} - newly created buddy object
 */
export const createBuddyHandler = asyncHandler(async (req, res) => {
	const { realName, nickName, dob, hobbies } = req.body;

	if (!realName || !nickName || !dob || !hobbies || hobbies.length === 0) {
		throw new AppError(400, "All fields are required");
	}

	const newBuddy = await createBuddy({ realName, nickName, dob, hobbies });
	res.status(201).json(newBuddy);
});

/**
 * @desc update buddy by id
 * @route PUT /buddies/:id
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @returns {Object} - updated buddy object
 */
export const updateBuddyHandler = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const updatedBuddy = await updateBuddy(id, req.body);

	if (!updatedBuddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.status(200).json(updatedBuddy);
});

/**
 * @desc delete buddy by id
 * @route DELETE /buddies/:id
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @returns {Object} - confirmation message
 */
export const deleteBuddyHandler = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const deletedBuddy = await deleteBuddy(id);

	if (!deletedBuddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.status(200).json({ message: "Deleted successfully" });
});
