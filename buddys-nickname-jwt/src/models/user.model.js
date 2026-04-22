// imports
import mongoose from "mongoose";

// user schema
const UserSchema = mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	realName: { type: String, required: true },
	nickName: { type: String, required: true },
	dob: { type: String, required: true },
	hobbies: [{ type: String, required: true }],
	buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

// user model
export const User = mongoose.model("users", UserSchema);
