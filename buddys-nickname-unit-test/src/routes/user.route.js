// imports
import express from "express";
import {
	addBuddyHandler,
	createUserHandler,
	deleteUserHandler,
	getAllBuddiesHandler,
	getBuddyHandler,
	getUserHandler,
	loginUserHandler,
	logout,
	removeBuddyHandler,
	updateUserHandler,
} from "../controllers/user.controller.js";
import { JWTHandlerMiddleware } from "../middlewares/jwt.middleware.js";

// create a router
export const userRouter = express.Router();

// define routes
userRouter.post("/", createUserHandler);
userRouter.post("/login", loginUserHandler);

// middleware for authorization
userRouter.use(JWTHandlerMiddleware);

// define routes
userRouter.get("/", getUserHandler);
userRouter.put("/", updateUserHandler);
userRouter.delete("/", deleteUserHandler);
userRouter.get("/buddies", getAllBuddiesHandler);
userRouter.get("/buddies/:buddyUsername", getBuddyHandler);
userRouter.post("/buddies/:buddyUsername", addBuddyHandler);
userRouter.delete("/buddies/:buddyUsername", removeBuddyHandler);
userRouter.post("/logout", logout);
