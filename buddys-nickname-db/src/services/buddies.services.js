// imports
import { Buddy } from "../models/index.js";

/**
 * @desc Get all buddies from the database
 * @returns {list} list<Buddies>
 */
export const getAllBuddies = async () => {
	const buddies = await Buddy.find();
	return buddies;
};

/**
 * @desc Get a buddy by ID or name
 * @param {string} identifier - unique identifier
 * @param {string} identifierType - type of identifier (id or name)
 * @returns {object} Buddy
 */
export const getBuddy = async (identifier, identifierType) => {
	let buddy;
	if (identifierType === "id") {
		buddy = await Buddy.find({
			employeeId: { $regex: `^${identifier}$`, $options: "i" },
		});
	} else if (identifierType === "name") {
		buddy = await Buddy.find({
			realName: { $regex: `^${identifier}$`, $options: "i" },
		});
	}

	return buddy;
};

/**
 * @desc Create a new buddy
 * @param {object} data - buddy data
 * @returns {object} Created buddy
 */
export const createBuddy = async (data) => {
	const buddy = await Buddy.create({
		...data,
		employeeId: `EMP${Date.now()}`,
	});

	return buddy;
};

/**
 * @desc Update a buddy by ID
 * @param {string} id - unique identifier
 * @param {object} data - updated buddy data
 * @returns {object} Updated buddy
 */
export const updateBuddy = async (id, data) => {
	const updatedBuddy = await Buddy.findOneAndUpdate({ employeeId: id }, data, {
		new: true,
	});

	return updatedBuddy;
};

/**
 * @desc Delete a buddy by ID
 * @param {string} id - unique identifier
 * @returns {object} Deleted buddy
 */
export const deleteBuddy = async (id) => {
	const deletedBuddy = await Buddy.findOneAndDelete({ employeeId: id });
	return deletedBuddy;
};
