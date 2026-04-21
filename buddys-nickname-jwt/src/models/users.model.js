import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const BuddySchema = mongoose.Schema({
	realName: { type: String, required: true },
	nickName: { type: String, required: true },
	dob: { type: String, required: true },
	hobbies: { type: [String], required: true },
	employeeId: { type: String, default: uuidv4() },
});

const UserSchema = mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	buddies: { type: [BuddySchema], default: [] },
});

export const User = mongoose.model("users", UserSchema);
