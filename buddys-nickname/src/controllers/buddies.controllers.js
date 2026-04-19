// imports
import { readBuddies, writeBuddies } from "../services/index.js";
import { AppError } from "../utils/index.js";

// get all buddies
export const getAllBuddies = async (_req, res) => {
	const buddies = await readBuddies();
	res.status(200).json(buddies);
};

// get buddy by id or name
export const getBuddy = async (req, res) => {
	const { id, name } = req.query;
	const buddies = await readBuddies();

	const buddy = buddies.filter(
		(b) =>
			b.employeeId === id || b.realName?.toLowerCase() === name?.toLowerCase(),
	);

	if (!buddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.status(200).json(buddy);
};

// add a new buddy
export const createNewBuddy = async (req, res) => {
	// get existing buddies
	const buddies = await readBuddies();
	const { realName, nickName, dob, hobbies } = req.body;

	if (!realName || !nickName || !dob || !hobbies || hobbies.length === 0) {
		throw new AppError(400, "All fields are required");
	}

	const newBuddy = { ...req.body, employeeId: `EMP${Date.now()}` };
	buddies.push(newBuddy);
	await writeBuddies(buddies);

	res.status(201).json(newBuddy);
};

// update buddy by id
export const updateBuddy = async (req, res) => {
	const { id } = req.params;
	const buddies = await readBuddies();

	const index = buddies.findIndex((b) => b.employeeId === id);

	if (index === -1) throw new AppError(404, "Buddy not found");

	buddies[index] = { ...buddies[index], ...req.body };

	await writeBuddies(buddies);

	res.json(buddies[index]);
};

// delete buddy by id
export const deleteBuddy = async (req, res) => {
	const { id } = req.params;
	const buddies = await readBuddies();

	const filtered = buddies.filter((b) => b.employeeId !== id);

	if (filtered.length === buddies.length)
		throw new AppError(404, "Buddy not found");

	await writeBuddies(filtered);

	res.json({ message: "Deleted successfully" });
};
