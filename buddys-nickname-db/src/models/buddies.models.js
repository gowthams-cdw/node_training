// imports
import mongoose from "mongoose";

// buddy schema
const buddySchema = new mongoose.Schema({
	realName: { type: String, required: true },
	nickName: { type: String, required: true },
	dob: { type: String, required: true },
	hobbies: { type: [String], required: true },
	employeeId: { type: String, required: true, unique: true },
});

// buddy model
export const Buddy = mongoose.model("Buddy", buddySchema);
