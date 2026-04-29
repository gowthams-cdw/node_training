// imports
import * as bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";
import { removeToken } from "../utils/tokenStore.js";

/**
 * @desc get user by username
 * @param {string} username
 * @param {boolean} returnPassword
 * @param {boolean} populateBuddies
 * @returns {Promise<User>} fetched user object
 */
export const getUser = async (
	username,
	returnPassword = false,
	populateBuddies = true,
) => {
	const projection = returnPassword ? {} : { password: 0 };

	let query = User.findOne(
		{
			username: username.toLowerCase(),
		},
		projection,
	);

	if (populateBuddies) {
		query = query.populate("buddies");
	}

	const user = await query;

	return user;
};

/**
 * @desc create a new user
 * @param {User} user object
 * @returns {Promise<User>} created user object
 */
export const createUser = async ({
	username,
	password,
	realName,
	nickName,
	dob,
	hobbies,
	buddies,
}) => {
	// processed values
	const processedUserDetails = {};

	if (username) processedUserDetails.username = username.toLowerCase();
	if (password) {
		const BCRYPT_HASH = process.env.BCRYPT_HASH;

		if (!BCRYPT_HASH) {
			throw new AppError(500, "BCRYPT_HASH not configured in the server");
		}

		processedUserDetails.password = await bcrypt.hash(password, BCRYPT_HASH);
	}

	if (realName) processedUserDetails.realName = realName;
	if (nickName) processedUserDetails.nickName = nickName;
	if (dob) processedUserDetails.dob = dob;
	if (hobbies) processedUserDetails.hobbies = hobbies;

	if (buddies) {
		processedUserDetails.buddies = await Promise.all(
			buddies.map(async (buddy) => {
				const buddyUser = await getUser(buddy);

				if (!buddyUser) {
					throw new AppError("404", "Buddy not found");
				}

				return buddyUser._id;
			}),
		);
	}

	// throw error on invalid details
	if (Object.keys(processedUserDetails).length === 0) {
		throw new AppError(400, "Invalid details.");
	}

	const user = await User.create(processedUserDetails);

	const userObj = user.toObject();

	// remove the user from the returned document
	delete userObj.password;

	return userObj;
};

/**
 * @desc update an existing user
 * @param {User} existingUser
 * @param {Object} user details
 * @returns {Promise<User>} updated user object
 */
export const updateUser = async (
	existingUser,
	{ password, realName, nickName, dob, hobbies, buddies },
) => {
	// processed values
	const processedUserDetails = {};

	if (password) {
		const BCRYPT_HASH = process.env.BCRYPT_HASH;

		if (!BCRYPT_HASH) {
			throw new AppError(500, "BCRYPT_HASH not configured in the server");
		}

		processedUserDetails.password = await bcrypt.hash(password, BCRYPT_HASH);
	}

	if (realName) processedUserDetails.realName = realName;
	if (nickName) processedUserDetails.nickName = nickName;
	if (dob) processedUserDetails.dob = dob;
	if (hobbies) processedUserDetails.hobbies = hobbies;

	if (buddies) {
		processedUserDetails.buddies = await Promise.all(
			buddies.map(async (buddy) => {
				const buddyUser = await getUser(buddy);

				if (!buddyUser) {
					throw new AppError(404, "Buddy not found");
				}

				return buddyUser._id;
			}),
		);
	}

	// throw error on invalid details
	if (Object.keys(processedUserDetails).length === 0) {
		throw new AppError(400, "Invalid details.");
	}

	Object.assign(existingUser, processedUserDetails);
	await existingUser.save();

	const userObj = existingUser.toObject();
	// remove the user from the returned document
	delete userObj.password;
	return userObj;
};

/**
 * @desc delete an existing user
 * @param {User} existingUser
 * @param {token} token - access token of the user to be deleted, to remove from token store
 */
export const deleteUser = async (existingUser, token) => {
	await existingUser.deleteOne();
	removeToken(token);
};
