// imports
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	createUser,
	deleteUser,
	getUser,
	updateUser,
} from "../services/user.service.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addToken, removeToken } from "../utils/tokenStore.js";

/**
 * @desc create a new user
 * @route POST /users
 * @param {User} user object
 * @returns {Promise<User>} created user object
 */
export const createNewUser = asyncHandler(async (req, res) => {
	const {
		username,
		password,
		realName,
		nickName,
		dob,
		hobbies = [],
		buddies = [],
	} = req.body;

	if (!username || !password) {
		throw new AppError(400, "Invalid request body.");
	}

	const existingUser = await getUser(username);

	if (existingUser) {
		throw new AppError(409, "User already exists."); // 409 - conflicts
	}

	const user = await createUser({
		username,
		password,
		realName,
		nickName,
		dob,
		hobbies,
		buddies,
	});

	res.status(201).json(user);
});

/**
 * @desc login into a specific user
 * @route POST /users/login
 * @param {User} user object
 * @returns {Promise<User>} logged in user object
 */
export const loginUser = asyncHandler(async (req, res) => {
	const JWT_HASH = process.env.JWT_HASH;

	if (!JWT_HASH) {
		throw new AppError(500, "JWT_HASH not configured in the server");
	}

	const { username, password } = req.body;

	if (!username || !password) {
		throw new AppError(400, "Invalid request body.");
	}

	const existingUser = await getUser(username, true);

	if (!existingUser) {
		throw new AppError(404, "User not found.");
	}

	const isValidPassword = await bcrypt.compare(password, existingUser.password);
	if (!isValidPassword) {
		throw new AppError(401, "Invalid credentials.");
	}

	const token = jwt.sign({ username }, JWT_HASH, { expiresIn: "1d" });
	addToken(token);
	res.status(200).send({
		accessToken: token,
	});
});

/**
 * @desc get the current user details
 * @route GET /users
 * @returns {Promise<User>} fetched user object
 */
export const getUserByUserName = asyncHandler(async (req, res) => {
	const username = req.username;

	const user = await getUser(username);

	if (!user) {
		throw new AppError(404, "User not found");
	}

	res.status(200).send(user);
});

/**
 * @desc update the current user details
 * @route PUT /users
 * @param {User} user object
 * @returns {Promise<User>} updated user object
 */
export const updateUserByUserName = asyncHandler(async (req, res) => {
	const username = req.username;
	const existingUser = await getUser(username);

	if (!existingUser) {
		throw new AppError(404, "User not found.");
	}

	const updatedUser = await updateUser(existingUser, req.body);

	res.status(201).send(updatedUser);
});

/**
 * @desc delete the current user
 * @route DELETE /users
 * @returns {Promise<{message: string}>} success message
 */
export const deleteUserByUserName = asyncHandler(async (req, res) => {
	const username = req.username;
	const token = req.token;

	const existingUser = await getUser(username);

	if (!existingUser) {
		throw new AppError(404, "User not found.");
	}

	await deleteUser(existingUser, token);

	res.status(200).send({ message: "user deleted successfully." });
});

/**
 * @desc get all buddies of the current user
 * @route GET /users/buddies
 * @returns {Promise<Array>} list of buddies of the current user
 */
export const getBuddies = asyncHandler(async (req, res) => {
	const username = req.username;

	const user = await getUser(username);
	if (!user) {
		throw new AppError(404, "User not found");
	}

	res.status(200).send(user.buddies);
});

/**
 * @desc get a specific buddy of the current user
 * @route GET /users/buddies/:buddyUsername
 * @param {string} buddyUsername - username of the buddy to be fetched
 * @returns {Promise<Object>} buddy object
 */
export const getBuddy = asyncHandler(async (req, res) => {
	const username = req.username;
	const { buddyUsername } = req.params;

	const user = await getUser(username);
	if (!user) {
		throw new AppError(404, "User not found");
	}

	const buddy = user.buddies.find((buddy) => buddy.username === buddyUsername);

	if (!buddy) {
		throw new AppError(404, "Buddy not found");
	}

	res.status(200).send(buddy);
});

/**
 * @desc add new buddy to the current user
 * @route POST /users/buddies/:buddyUsername
 * @param {string} buddyUsername - username of the buddy to be added
 * @returns {Promise<Object>} updated user object with the new buddy added
 */
export const addBuddy = asyncHandler(async (req, res) => {
	const username = req.username;
	const { buddyUsername } = req.params;

	// cannot be buddy to themselves
	if (buddyUsername === username) {
		throw new AppError(400, "Cannot add yourself as buddy");
	}

	const existingUser = await getUser(username);
	if (!existingUser) {
		throw new AppError(404, "User not found");
	}

	const buddies = existingUser.buddies
		.map((buddy) => buddy.username)
		.concat(buddyUsername);
	const updatedUser = await updateUser(existingUser, { buddies });

	res.status(200).send(updatedUser);
});

/**
 * @desc remove a buddy from the current user
 * @route DELETE /users/buddies/:buddyUsername
 * @param {string} buddyUsername - username of the buddy to be removed
 * @returns {Promise<Object>} updated user object with the buddy removed
 */
export const removeBuddy = asyncHandler(async (req, res) => {
	const username = req.username;
	const { buddyUsername } = req.params;

	const existingUser = await getUser(username);
	if (!existingUser) {
		throw new AppError(404, "User not found");
	}

	const buddies = existingUser.buddies
		.map((buddy) => buddy.username)
		.filter(
			(currentUsername) => currentUsername !== buddyUsername.toLowerCase(),
		);
	const updatedUser = await updateUser(existingUser, { buddies });

	res.status(200).send(updatedUser);
});

/**
 * @desc logout the current user by removing the token from the token store
 * @route POST /users/logout
 * @returns {Promise<{message: string}>} success message
 */
export const logout = asyncHandler(async (req, res) => {
	const token = req.token;
	removeToken(token);

	res.status(200).send({ message: "user logged out successfully" });
});
