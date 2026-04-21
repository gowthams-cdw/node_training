// imports
import { Buddy } from "../models/index.js";
import { AppError, asyncHandler } from "../utils/index.js";

/**
 * @desc get all buddies
 * @route GET /buddies
 * @param {*} _req - request from the client
 * @param {*} res - response from the server
 * @returns {Array} - list of all buddies
 */
export const getAllBuddies = asyncHandler(async (_req, res) => {
	const buddies = await Buddy.find();
	res.status(200).json(buddies);
});

/**
 * @desc get buddy by id or name
 * @route GET /buddies/search
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @returns {Object} - buddy object if found
 */
export const getBuddy = asyncHandler(async (req, res) => {
	const { id, name } = req.query;

	let buddy;
	if (id) {
		buddy = await Buddy.find({
			employeeId: { $regex: `^${id}$`, $options: "i" },
		});
	} else if (name) {
		buddy = await Buddy.find({
			realName: { $regex: `^${name}$`, $options: "i" },
		});
	} else {
		throw new AppError(400, "Provide either id or name to search");
	}

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
export const createNewBuddy = asyncHandler(async (req, res) => {
	const { realName, nickName, dob, hobbies } = req.body;

	if (!realName || !nickName || !dob || !hobbies || hobbies.length === 0) {
		throw new AppError(400, "All fields are required");
	}

	const newBuddy = await Buddy.create({
		...req.body,
		employeeId: `EMP${Date.now()}`,
	});

	res.status(201).json(newBuddy);
});

/**
 * @desc update buddy by id
 * @route PUT /buddies/:id
 * @param {*} req - request from the client
 * @param {*} res - response from the server
 * @returns {Object} - updated buddy object
 */
export const updateBuddy = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const updatedBuddy = await Buddy.findOneAndUpdate(
		{ employeeId: id },
		req.body,
		{ new: true },
	);

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
export const deleteBuddy = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const deletedBuddy = await Buddy.findOneAndDelete({ employeeId: id });

	if (!deletedBuddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.status(200).json({ message: "Deleted successfully" });
});
