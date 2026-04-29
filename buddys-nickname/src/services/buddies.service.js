// imports
import fs from "node:fs";
import { DATA_FILE_PATH } from "../constants/index.js";

/**
 * @desc 	Read buddies data from the json file
 * @returns {object} content from the json file
 */
export const readBuddies = () => {
	const data = fs.readFile(DATA_FILE_PATH, "utf-8");
	return JSON.parse(data);
};

/**
 * @desc 	Write buddies data to the json file
 * @param {object} new buddy data
 */
export const writeBuddies = (buddies) => {
	fs.writeFile(DATA_FILE_PATH, JSON.stringify(buddies, null, 2));
};
