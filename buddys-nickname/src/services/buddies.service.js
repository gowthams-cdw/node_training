// imports
import fs from "fs";
import { DATA_FILE_PATH } from "../constants/index.js";

// read buddies file and return the content as JSON
export const readBuddies = async () => {
	const data = await fs.promises.readFile(DATA_FILE_PATH, "utf-8");
  return JSON.parse(data);
};

// write to buddies file with the given buddies data
export const writeBuddies = async (buddies) => {
	await fs.promises.writeFile(DATA_FILE_PATH, JSON.stringify(buddies, null, 2));
};
