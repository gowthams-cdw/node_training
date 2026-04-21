// imports
import express from "express";
import {
	createUser,
	deleteBuddy,
	deleteUser,
	getAllBuddies,
	getBuddy,
	insertBuddy,
	loginUser,
	updateBuddy,
	updateUser,
} from "../controllers/user.controller.js";
import { JWTHandlerMiddleware } from "../middlwares/jwt.middleware.js";

// create a router
export const userRouter = express.Router();

// define routes
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);

// middleware for authorization
userRouter.use(JWTHandlerMiddleware);

// define routes
userRouter.put("/update", updateUser);
userRouter.delete("/delete", deleteUser);
userRouter.get("/buddies", getAllBuddies);
userRouter.get("/buddies/:buddyId", getBuddy);
userRouter.delete("/buddies/delete/:removeBuddyId", deleteBuddy);
userRouter.post("/buddies/insert", insertBuddy);
userRouter.put("/buddies/update/:updateBuddyId", updateBuddy);
