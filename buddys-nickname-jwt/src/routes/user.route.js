// imports
import express from "express";
import {
	addBuddy,
	createNewUser,
	deleteUserByUserName,
	getBuddies,
	getBuddy,
	getUserByUserName,
	loginUser,
	logout,
	removeBuddy,
	updateUserByUserName,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

// create a router
export const userRouter = express.Router();

// define routes
userRouter.post("/", createNewUser);
userRouter.post("/login", loginUser);

// middleware for authorization
userRouter.use(verifyJWT);

// define routes
userRouter.get("/", getUserByUserName);
userRouter.put("/", updateUserByUserName);
userRouter.delete("/", deleteUserByUserName);
userRouter.get("/buddies", getBuddies);
userRouter.get("/buddies/:buddyUsername", getBuddy);
userRouter.post("/buddies/:buddyUsername", addBuddy);
userRouter.delete("/buddies/:buddyUsername", removeBuddy);
userRouter.post("/logout", logout);
