// imports
import { Buddy } from "../models/index.js";
import { AppError } from "../utils/index.js";

// get all buddies
export const getAllBuddies = async (_req, res) => {
	const buddies = await Buddy.find();
	res.status(200).json(buddies);
};

// get buddy by id or name
export const getBuddy = async (req, res) => {
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
};

// add a new buddy
export const createNewBuddy = async (req, res) => {
	const { realName, nickName, dob, hobbies } = req.body;

	if (!realName || !nickName || !dob || !hobbies || hobbies.length === 0) {
		throw new AppError(400, "All fields are required");
	}

	const newBuddy = await Buddy.create({
		...req.body,
		employeeId: `EMP${Date.now()}`,
	});

	res.status(201).json(newBuddy);
};

// update buddy by id
export const updateBuddy = async (req, res) => {
	const { id } = req.params;

	const updatedBuddy = await Buddy.findOneAndUpdate(
		{ employeeId: id },
		req.body,
		{ new: true },
	);

	if (!updatedBuddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.json(updatedBuddy);
};

// delete buddy by id
export const deleteBuddy = async (req, res) => {
	const { id } = req.params;

	const deletedBuddy = await Buddy.findOneAndDelete({ employeeId: id });

	if (!deletedBuddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.json({ message: "Deleted successfully" });
};
