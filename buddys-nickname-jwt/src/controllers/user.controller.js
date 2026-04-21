// imports
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/users.model.js";
import { AppError } from "../utils/appError.js";

// create a new user
export const createUser = async (req, res) => {
	const BCRYPT_HASH = process.env.BCRYPT_HASH || "node_training_salt";

	const { username, password, buddies = [] } = req.body;

	if (!username || !password) {
		throw new AppError(400, "Invalid request body.");
	}

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (existingUser) {
		throw new AppError(401, "User already exists.");
	}

	const hashedPassword = await bcrypt.hash(password, BCRYPT_HASH);

	const user = await User.create({
		username,
		password: hashedPassword,

		// assign employeeId to the buddies
		buddies:
			buddies.length !== 0
				? buddies.map((b) => ({ ...b, employeeId: uuidv4() }))
				: buddies,
	});

	res.status(201).json(user);
};

// login into a specific user
export const loginUser = async (req, res) => {
	const JWT_HASH = process.env.JWT_HASH || "node_training_salt";

	const { username, password } = req.body;

	if (!username || !password) {
		throw new AppError(400, "Invalid request body.");
	}

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (!existingUser) {
		throw new AppError(203, "User not found.");
	}

	const isValidPassword = await bcrypt.compare(password, existingUser.password);
	if (!isValidPassword) {
		throw new AppError(203, "Invalid credentials.");
	}

	res.status(200).send({
		accessToken: jwt.sign({ username }, JWT_HASH, { expiresIn: "1d" }),
	});
};

// update the current user
export const updateUser = async (req, res) => {
	const BCRYPT_HASH = process.env.BCRYPT_HASH || "node_training_salt";

	const username = req.username;
	const { password, buddies } = req.body;

	if (!password && (!buddies || buddies.length === 0)) {
		throw new AppError(400, "Invalid body to update user.");
	}

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (!existingUser) {
		throw new AppError(203, "User not found.");
	}

	const newData = {};
	if (password) {
		const hashedPassword = await bcrypt.hash(password, BCRYPT_HASH);
		newData.password = hashedPassword;
	}
	if (buddies) {
		const buddiesWithEmployeeId = buddies.map((b) => ({
			...b,
			employeeId: uuidv4(),
		}));
		newData.buddies = buddiesWithEmployeeId;
	}

	const updatedUser = await User.findOneAndUpdate(
		{
			username: { $regex: `^${username}$`, $options: "i" },
		},
		newData,
		{ new: true },
	);

	res.status(201).send(updatedUser);
};

// delete the current user
export const deleteUser = async (req, res) => {
	const username = req.username;

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (!existingUser) {
		throw new AppError(203, "User not found.");
	}

	await User.findOneAndDelete({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	res.status(201).send({ message: "user deleted successfully." });
};

// get all buddies of the current user
export const getAllBuddies = async (req, res) => {
	const username = req.username;

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (!existingUser) {
		throw new Error(203, "user not found");
	}

	return res.status(200).json(existingUser.buddies);
};

// get a specific buddy from the current user
export const getBuddy = async (req, res) => {
	const username = req.username;
	const { buddyId } = req.params;

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (!existingUser) {
		throw new Error(203, "user not found");
	}

	const buddy = existingUser.buddies.find((b) => b.employeeId === buddyId);

	if (!buddy) {
		throw new Error(203, "buddy not found");
	}

	return res.status(200).json(buddy);
};

// remove a specific buddy from the current user
export const deleteBuddy = async (req, res) => {
	const username = req.username;
	const { removeBuddyId } = req.params;

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (!existingUser) {
		throw new Error(203, "user not found");
	}

	const buddies = existingUser.buddies;
	const newBuddies = buddies.filter((b) => b.employeeId !== removeBuddyId);

	const updatedUser = await User.findOneAndUpdate(
		{
			username: { $regex: `^${username}$`, $options: "i" },
		},
		{ buddies: newBuddies },
		{ new: true },
	);

	res.status(201).send(updatedUser);
};

// insert a specific buddy from the current user
export const insertBuddy = async (req, res) => {
	const username = req.username;

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});

	if (!existingUser) {
		throw new Error(203, "user not found");
	}

	const buddies = existingUser.buddies;
	const newBuddy = { ...req.body, employeeId: uuidv4() };
	buddies.push(newBuddy);

	const updatedUser = await User.findOneAndUpdate(
		{
			username: { $regex: `^${username}$`, $options: "i" },
		},
		{ buddies },
		{ new: true },
	);

	res.status(201).send(updatedUser);
};

// update a specific buddy from the current user
export const updateBuddy = async (req, res) => {
	const username = req.username;
	const { updateBuddyId } = req.params;

	const existingUser = await User.findOne({
		username: { $regex: `^${username}$`, $options: "i" },
	});
	if (!existingUser) {
		throw new AppError(203, "user not found");
	}

	const buddies = existingUser.buddies;
	const existingBuddy = buddies.find((b) => b.employeeId === updateBuddyId);

	if (!existingBuddy) {
		throw new AppError(203, "buddy not found");
	}

	// avoid overwrite of employeeId
	if (req.body.employeeId) {
		delete req.body.employeeId;
	}

	// Remove the old buddy and add the updated one
	const newBuddies = buddies
		.filter((b) => b.employeeId !== updateBuddyId)
		.concat({ ...existingBuddy.toObject(), ...req.body });

	const updatedUser = await User.findOneAndUpdate(
		{ username: { $regex: `^${username}$`, $options: "i" } },
		{ buddies: newBuddies },
		{ new: true },
	);

	res.status(200).json(updatedUser);
};
